import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";
import { OrderRepository } from "./order.repository";
import { Response } from "express";
import { CheckOrder, DeliveryOrder, LastVerifiedOrder, Order, orders } from "../entities/Order";
import { users } from "../entities/User";
import { VerifyOrderDto } from "./dto/verify-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { Product } from "../entities/Product";
import { ProductRepository } from "../product/product.repository";
import {
   AppRoles,
   DatabaseCartProduct,
   DeliveryDetails,
   ListResponse,
   OrderQueue,
   OrderStatus,
   ResponseUserOrder,
   VerifiedQueueOrder,
   WaitingQueueOrder
} from "../../../common/types";
import { CompleteOrderDto } from "./dto/complete-order.dto";
import { UnexpectedServerError } from "../../packages/exceptions/unexpected-errors.exceptions";
import {
   CancelExplanationHasNotBeenProvided,
   InvalidOrderStatus,
   OrderCannotBeCompleted,
   OrderCannotBePaid,
   OrderCannotBeVerified,
   OrderDoesNotExist
} from "../../packages/exceptions/order.exceptions";
import { Events } from "../../packages/event/events";
import { MiscService } from "../miscellaneous/misc.service";
import { QueueOrderDto } from "./dto/queue-order.dto";
import { Miscellaneous } from "../entities/Miscellaneous";
import { PinoLogger } from "nestjs-pino";
import { DeliveryService } from "../delivery/delivery.service";
import { EventsService } from "../../packages/event/event.module";
import { EventEmitter } from "node:events";

@Injectable()
export class OrderService {
   private events: EventEmitter;

   constructor(
      private orderRepository: OrderRepository,
      private productRepository: ProductRepository,
      private miscService: MiscService,
      private logger: PinoLogger,
      private deliveryService: DeliveryService,
      private eventService: EventsService
   ) {
      this.events = eventService.GetEmitter();
      this.logger.setContext(OrderService.name);
   }
   public async createUserOrder(dto: CreateUserOrderDto): Promise<Order> {
      this.logger.debug(`create order for user ${dto.user_id}`);

      let total_cart_price = await this.calculateTotalCartPrice(dto.cart);
      if (dto.is_delivered) {
         total_cart_price = await this.applyDeliveryPunishment(total_cart_price);
      }
      dto.total_cart_price = total_cart_price;

      //todo: switch to utc time now() pg
      await this.orderRepository.createUserOrder(dto);
      this.logger.debug("saved order to db");
      this.events.emit(Events.REFRESH_ORDER_QUEUE);
      return;
   }

   public async createMasterOrder(createMasterOrderDto: CreateMasterOrderDto): Promise<void> {
      this.logger.info(`create master order for ${createMasterOrderDto.userId}`);
      let total_cart_price = await this.calculateTotalCartPrice(createMasterOrderDto.cart);
      if (createMasterOrderDto.is_delivered) {
         total_cart_price = await this.applyDeliveryPunishment(total_cart_price);
      }
      // Make sure total cart price is correct and punishment for delivery is applied.
      createMasterOrderDto.total_cart_price = total_cart_price;
      await this.orderRepository.createMasterOrder(createMasterOrderDto);
      this.logger.debug("saved order to db");
      this.events.emit(Events.REFRESH_ORDER_QUEUE);
      return;
   }

   public async verifyOrder(verifyOrderDto: VerifyOrderDto): Promise<OrderStatus> {
      this.logger.info(`verify order for ${verifyOrderDto.userId}`);
      try {
         const { phoneNumber } = verifyOrderDto;
         //Get orderId that method verifies and if there's more waiting orders for this user
         const hasOrd = await this.hasWaitingOrder(null, phoneNumber);
         const { id: orderId, has } = hasOrd;
         this.logger.debug(`user has waiting order: ${has}`);
         //Does not have waiting order
         if (!has) {
            throw new Error(`verification ${phoneNumber}`);
         }
         const { deliveryDetails, isDelivered, cart, isDeliveredAsap } = verifyOrderDto;
         //todo: use utc time
         const now = new Date(Date.now());
         //Fetch older delivery details to obtain comment
         const prevDeliveryDetails: DeliveryDetails = await this.orderRepository.getDeliveryDetails(orderId);

         const updated: Partial<Order> = {
            status: OrderStatus.verified,
            verified_at: now,
            is_delivered_asap: isDeliveredAsap
         };

         //Update delivery status
         if (verifyOrderDto.isDelivered !== undefined) {
            this.logger.debug("update is delivered");
            updated.is_delivered = isDelivered;
            //Optionally change delivery details and make sure comment stays with it (*verify order form doesn't send a comment)
            if (prevDeliveryDetails?.comment !== "" && verifyOrderDto.isDelivered) {
               this.logger.debug("save a comment");
               updated.delivery_details = {
                  ...deliveryDetails,
                  comment: prevDeliveryDetails.comment
               };
            }
         }
         //Recalculate cart price if cart is sent (*changed)
         if (verifyOrderDto.cart !== undefined) {
            this.logger.debug("recalculate cart price");
            const recalculatedTotalCartPrice = await this.calculateTotalCartPrice(cart);
            updated.cart = cart;
            updated.total_cart_price = recalculatedTotalCartPrice;
         }
         //todo: change for verify method
         await this.orderRepository.update(orderId, updated);
         this.logger.debug("verified order");
         this.events.emit(Events.REFRESH_ORDER_QUEUE);
         return OrderStatus.verified;
      } catch (e) {
         if (e.message.includes("verification")) {
            const phone = e.message.split(" ").pop();
            throw new OrderCannotBeVerified(phone);
         }
         console.error(e);
         throw new UnexpectedServerError();
      }
   }

   public async cancelOrder(userId: number, cancelOrderDto: CancelOrderDto): Promise<boolean | string> {
      const { role } = cancelOrderDto;
      // user cancels
      if (!(role == AppRoles.worker || role == AppRoles.master)) {
         const { order_id } = cancelOrderDto;
         const o = await this.orderRepository.getById(order_id);
         if (o.status === OrderStatus.cancelled || o.status === OrderStatus.completed) {
            throw new ForbiddenException("Некорректный статус заказа");
         }
         try {
            const updated: Partial<Order> = {
               cancel_explanation: cancelOrderDto.cancel_explanation,
               status: OrderStatus.cancelled,
               cancelled_at: new Date(Date.now()),
               cancelled_by: userId
            };
            await this.orderRepository.update(o.id, updated);
            this.events.emit(Events.REFRESH_ORDER_QUEUE);
            return true;
         } catch (e) {
            throw new UnexpectedServerError("Ошибка отмены заказа");
         }
      }
      // worker cancels
      if (!cancelOrderDto.cancel_explanation) {
         throw new CancelExplanationHasNotBeenProvided();
      }

      try {
         const updated: Partial<Order> = {
            cancel_explanation: cancelOrderDto.cancel_explanation,
            status: OrderStatus.cancelled,
            cancelled_at: new Date(Date.now()),
            cancelled_by: userId
         };

         await this.orderRepository.update(cancelOrderDto.order_id, updated);

         this.events.emit(Events.REFRESH_ORDER_QUEUE);
         return false;
      } catch (e) {
         throw new UnexpectedServerError("Ошибка отмены заказа");
      }
   }

   public async completeOrder(dto: CompleteOrderDto): Promise<OrderStatus> {
      const { order_id } = dto;
      const o = (
         await this.orderRepository.get({
            where: { id: order_id, status: OrderStatus.verified }
         })
      )[0];
      if (!o) {
         throw new OrderCannotBeCompleted(order_id);
      }

      const updated: Partial<Order> = {
         completed_at: new Date(Date.now()),
         status: OrderStatus.completed
      };

      await this.orderRepository.update(order_id, updated);
      this.events.emit(Events.REFRESH_ORDER_QUEUE);

      return OrderStatus.completed;
   }

   public mapRawHistory(raw: Order[]): ResponseUserOrder[] {
      return raw.map((o: Order) => {
         const { total_cart_price, id, created_at, status, is_delivered, delivery_details, cart, is_delivered_asap } = o;
         const rso: ResponseUserOrder = {
            total_cart_price,
            id,
            created_at,
            status,
            is_delivered,
            delivery_details,
            cart,
            is_delivered_asap
         };
         return rso;
      });
   }

   public async userOrderHistory(userId: number): Promise<ResponseUserOrder[]> {
      const rawHistory: Order[] = await this.orderRepository.getUserOrderHistory(userId);
      return this.mapRawHistory(rawHistory);
   }

   public async getLastVerifiedOrder(phoneNumber: string): Promise<LastVerifiedOrder> {
      return this.orderRepository.getLastVerifiedOrder(phoneNumber);
   }

   public async hasWaitingOrder(user_id: number, phone_number: string): Promise<{ id: number; has: boolean }> {
      if (!phone_number) {
         const ord = (
            await this.orderRepository.get({
               where: {
                  user_id,
                  status: OrderStatus.waiting_for_verification
               },
               returning: ["id"]
            })
         )[0];
         if (ord === undefined) {
            return {
               id: 0,
               has: false
            };
         }
         return {
            id: ord.id,
            has: true
         };
      }

      const sql = `
        select o.id from ${orders} o join ${users} u on o.user_id=u.id
        where u.phone_number='${phone_number}' and o.status = '${OrderStatus.waiting_for_verification}'
      `;
      const ord = (await this.orderRepository.customQuery(sql))[0];
      if (ord === undefined) {
         return {
            id: 0,
            has: false
         };
      }
      return {
         id: ord.id,
         has: true
      };
   }

   public async calculateTotalCartPrice(cart: DatabaseCartProduct[]): Promise<number> {
      const productIds: number[] = [];

      for (const product of cart) {
         productIds.push(product.id);
      }

      try {
         const products: Product[] = await this.productRepository.getProductsByIds(productIds);
         const total_cart_price = products.reduce((a, c) => {
            const same_product_idx = cart.findIndex((p) => p.id == c.id);
            const product_quantity = cart[same_product_idx].quantity;
            a += c.price * product_quantity;
            return a;
         }, 0);
         return total_cart_price;
      } catch (e) {
         throw e;
      }
   }

   public async notifyQueueSubscribers(connections: Response[]): Promise<void> {
      const queue = await this.fetchOrderQueue();
      const chunk = `data: ${JSON.stringify({ queue })}\n\n`;

      connections
         .filter((conn) => conn.writable)
         .forEach((conn) => {
            conn.write(chunk);
         });
      return;
   }

   private async fetchOrderQueue(): Promise<OrderQueue> {
      try {
         const rawQueue = await this.orderRepository.getOrderQueue();
         const mapped = this.mapRawQueue(rawQueue);

         const verifIds = mapped.verified.map((ord) => ord.id);
         const statuses = await this.deliveryService.status(verifIds);
         mapped.verified = mapped.verified.map((order) => {
            order.isRunnerNotified = statuses.find((st) => st.orderId === order.id).status;
            return order;
         });
         return mapped;
      } catch (e) {
         this.logger.error(e);
         return {
            verified: [],
            waiting: []
         };
      }
   }

   public mapRawQueue(raw: QueueOrderDto[]): OrderQueue {
      const queue: OrderQueue = {
         waiting: [],
         verified: []
      };
      for (const rawOrder of raw) {
         const {
            status,
            is_delivered_asap,

            cart,
            delivery_details,
            created_at,
            total_cart_price,
            name,
            phone_number,
            is_delivered,
            id
         } = rawOrder;
         if (rawOrder.status === OrderStatus.waiting_for_verification) {
            const mapped: WaitingQueueOrder = {
               status,
               is_delivered,
               delivery_details: is_delivered ? delivery_details : null,
               is_delivered_asap,
               user: {
                  phone_number
               },
               cart: this.parseJsonCart(cart),
               created_at,
               total_cart_price,
               id
            };
            queue.waiting.push(mapped);
            continue;
         }
         const mapped: VerifiedQueueOrder = {
            is_delivered_asap,
            cart: this.parseJsonCart(cart),
            created_at,
            status,
            total_cart_price,
            delivery_details: is_delivered ? delivery_details : null,
            is_delivered,
            user: {
               name,
               phone_number
            },
            id
         };
         queue.verified.push(mapped);
      }
      return queue;
   }

   public async initialQueue() {
      const queue = await this.fetchOrderQueue();
      return queue;
   }

   public async orderList(status: OrderStatus): Promise<ListResponse | null> {
      if (!Object.values(OrderStatus).includes(status)) {
         throw new InvalidOrderStatus(status);
      } else if (!status || status.trim().length == 0) {
         throw new InvalidOrderStatus("");
      }

      let list: VerifiedQueueOrder[] = null;
      let output: ListResponse;
      //switch case prevents calls with orders which status is not completed or cancelled by throwing exception
      switch (status) {
         case OrderStatus.completed:
            list = await this.orderRepository.getOrderList(status);
            list = list.map((o) => {
               o.cart = this.parseJsonCart(o.cart);
               return o;
            });
            output = {
               cancel: [],
               complete: list
            };
            break;
         case OrderStatus.cancelled:
            list = await this.orderRepository.getOrderList(status);
            list = list.map((o) => {
               o.cart = this.parseJsonCart(o.cart);
               return o;
            });
            output = {
               cancel: list,
               complete: []
            };
            break;
         default:
            throw new InvalidOrderStatus(status);
      }

      return output;
   }

   async prepareDataForDelivery(orderId: number): Promise<DeliveryOrder> {
      this.logger.info(`prepare delivery data for order ${orderId}`);
      const data = await this.orderRepository.prepareDataForDelivery(orderId);
      if (!data) {
         throw new OrderDoesNotExist(orderId);
      }
      this.logger.info("prepare data success");
      return data;
   }

   async prepareDataForCheck(orderId: number): Promise<CheckOrder> {
      this.logger.info(`prepare check data for order ${orderId}`);
      const data = await this.orderRepository.prepareDataForCheck(orderId);
      if (!data) {
         throw new OrderDoesNotExist(orderId);
      }
      this.logger.debug("prepare data success");
      data.cart = this.parseJsonCart(data.cart);
      return data;
   }

   async applyDeliveryPunishment(p: number) {
      const v: Miscellaneous = await this.miscService.getAllValues();
      if (p <= v.delivery_punishment_threshold) {
         return p + v.delivery_punishment_value;
      }

      return p;
   }

   async calculateOrderSumInTerms(termsInDays: number, userId: number): Promise<number> {
      const raw: number[] = await this.orderRepository.getOrderSumInTerms(termsInDays, userId);
      return raw.reduce((acc, curr) => {
         acc += curr;
         return acc;
      }, 0);
   }

   parseJsonCart(currentCart: DatabaseCartProduct[]): DatabaseCartProduct[] {
      return currentCart.map((item) => JSON.parse(item as unknown as string));
   }
}
