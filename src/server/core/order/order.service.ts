import { Injectable } from "@nestjs/common";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";
import { UserService } from "../user/user.service";
import { OrderRepository } from "./order.repository";
import { Response } from "express";
import { Order, orders } from "../entities/Order";
import { User, users } from "../entities/User";
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
import { EventEmitter } from "events";
import { CompleteOrderDto } from "./dto/complete-order.dto";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";
import {
   CancelExplanationHasNotBeenProvided,
   InvalidOrderStatus,
   OrderCannotBeCompleted,
   OrderCannotBePaid,
   OrderCannotBeVerified
} from "../../shared/exceptions/order.exceptions";
import { JsonService } from "../../shared/database/json.service";
import { Events } from "../../shared/event/events";
import { MiscService } from "../miscellaneous/misc.service";
import { Miscellaneous } from "../../types/types";
import { QueueOrderDto } from "./dto/queue-order.dto";
import { LastVerifiedOrderDto } from "./dto/order.dto";

@Injectable()
export class OrderService {
   private events: EventEmitter;

   constructor(
      private orderRepository: OrderRepository,
      private userService: UserService,
      private jsonService: JsonService,
      private productRepository: ProductRepository,
      private miscService: MiscService
   ) {
      this.events = new EventEmitter();
   }

   public async createUserOrder(createUserOrderDto: CreateUserOrderDto, userId: number): Promise<void> {
      let total_cart_price = await this.calculateTotalCartPrice(createUserOrderDto.cart);
      total_cart_price = await this.applyDeliveryPunishment(total_cart_price);

      const userOrder: Order = {
         total_cart_price,
         ...createUserOrderDto,
         user_id: userId,
         status: OrderStatus.waiting_for_verification,
         created_at: new Date(Date.now())
      };
      await this.orderRepository.save(userOrder);

      if (userOrder.is_delivered === true) {
         const stringDetails: string = JSON.stringify(userOrder.delivery_details);
         await this.userService.updateUserRememberedDeliveryAddress(userId, stringDetails);
      }
      this.events.emit(Events.ORDER_HAS_CREATED);
      return;
   }

   public async createMasterOrder(createMasterOrderDto: CreateMasterOrderDto): Promise<void> {
      let userId = await this.userService.getUserId(createMasterOrderDto.phone_number);
      if (userId === undefined) {
         const registeredUser: User = (await this.userService.createUser({
            phone_number: createMasterOrderDto.phone_number
         })) as User;
         userId = registeredUser.id;
      }

      let total_cart_price = await this.calculateTotalCartPrice(createMasterOrderDto.cart);
      total_cart_price = await this.applyDeliveryPunishment(total_cart_price);

      const { username, is_delivered_asap, delivery_details, is_delivered, delivered_at, cart } = createMasterOrderDto;
      const now = new Date(Date.now());
      const masterOrder: Order = {
         is_delivered,
         cart,
         delivery_details: is_delivered ? delivery_details : null,
         total_cart_price,
         is_delivered_asap,
         user_id: userId,
         status: OrderStatus.verified,
         created_at: now,
         verified_at: now
      };
      this.userService.updateUsername(username, userId);
      if (masterOrder.is_delivered === true) {
         const stringDetails: string = JSON.stringify(masterOrder.delivery_details);
         await this.userService.updateUserRememberedDeliveryAddress(userId, stringDetails);
      }
      if (delivered_at !== null) {
         masterOrder.delivered_at = delivered_at;
      }
      //todo: get rid of this ( make array of jsons )
      this.jsonService.stringifyNestedObjects(masterOrder);

      await this.orderRepository.save(masterOrder);

      this.events.emit(Events.ORDER_HAS_CREATED);
      return;
   }

   public async verifyOrder(verifyOrderDto: VerifyOrderDto): Promise<OrderStatus> {
      try {
         const { phone_number } = verifyOrderDto;
         const hw = await this.hasWaitingOrder(null, phone_number);

         const { id: orderId, has } = hw;
         if (!has) {
            throw new Error(`verification ${phone_number}`);
         }
         const { username, delivery_details, is_delivered, cart, delivered_at, is_delivered_asap } = verifyOrderDto;
         const now = new Date(Date.now());
         const updated: Partial<Order> = {
            delivery_details: delivery_details !== undefined ? delivery_details : null,
            status: OrderStatus.verified,
            verified_at: now,
            is_delivered_asap
         };
         const userId = await this.userService.getUserId(phone_number);
         this.userService.updateUsername(username, userId);
         if (verifyOrderDto.is_delivered !== undefined) {
            updated.is_delivered = is_delivered;
         }
         if (verifyOrderDto.cart !== undefined) {
            const recalculatedTotalCartPrice = await this.calculateTotalCartPrice(cart);
            updated.cart = cart;
            updated.total_cart_price = recalculatedTotalCartPrice;
            this.jsonService.stringifyNestedObjects(updated);
         }
         if (delivered_at !== null) {
            updated.delivered_at = delivered_at;
         }

         await this.orderRepository.update(orderId, updated);

         this.events.emit(Events.ORDER_QUEUE_HAS_MODIFIED);
         return OrderStatus.verified;
      } catch (e) {
         if (e.message.includes("verification")) {
            const phone = e.message.split(" ").pop();
            throw new OrderCannotBeVerified(phone);
         }
         console.log(e);
         throw new UnexpectedServerError();
      }
   }

   public async cancelOrder(userId: number, cancelOrderDto: CancelOrderDto): Promise<boolean | string> {
      const role = await this.userService.getUserRole(userId);

      // user cancels
      if (!(role == AppRoles.worker || role == AppRoles.master)) {
         const { order_id } = cancelOrderDto;
         const o = await this.orderRepository.getById(order_id);
         if (o.status === OrderStatus.cancelled || o.status === OrderStatus.completed) {
            throw new UnexpectedServerError("Некоректный статус заказа");
         }
         try {
            const updated: Partial<Order> = {
               cancel_explanation: cancelOrderDto.cancel_explanation,
               status: OrderStatus.cancelled,
               cancelled_at: new Date(Date.now()),
               cancelled_by: userId
            };
            await this.orderRepository.update(o.id, updated);
            this.events.emit(Events.ORDER_QUEUE_HAS_MODIFIED);
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

         this.events.emit(Events.ORDER_QUEUE_HAS_MODIFIED);
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
      this.events.emit(Events.ORDER_QUEUE_HAS_MODIFIED);

      return OrderStatus.completed;
   }

   public mapRawHistory(raw: Order[]): ResponseUserOrder[] {
      return raw.map((o: Order) => {
         const { total_cart_price, id, created_at, status, is_delivered, delivery_details, cart, is_delivered_asap, delivered_at } = o;
         const rso: ResponseUserOrder = {
            total_cart_price,
            id,
            created_at,
            status,
            is_delivered,
            delivery_details,
            cart,
            is_delivered_asap,
            delivered_at
         };
         return rso;
      });
   }

   public async userOrderHistory(userId: number): Promise<ResponseUserOrder[]> {
      const rawHistory: Order[] = await this.orderRepository.getUserOrderHistory(userId);
      return this.mapRawHistory(rawHistory);
   }

   public async getLastVerifiedOrder(phoneNumber: string): Promise<LastVerifiedOrderDto> {
      return this.orderRepository.getLastVerifiedOrder(phoneNumber);
   }

   public async hasWaitingOrder(user_id: number, phone_number: string): Promise<{ id: number | null; has: boolean }> {
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
               id: null,
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
            id: null,
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

   public async orderQueue(res: Response) {
      this.events.on(Events.ORDER_HAS_CREATED, async () => {
         const queue = await this.fetchOrderQueue();
         const chunk = `data: ${JSON.stringify({ queue })}\n\n`;
         return res.write(chunk);
      });

      this.events.on(Events.ORDER_QUEUE_HAS_MODIFIED, async () => {
         const queue = await this.fetchOrderQueue();
         console.log(queue);
         const chunk = `data: ${JSON.stringify({ queue })}\n\n`;
         return res.write(chunk);
      });

      res.on("close", () => {
         console.log("closing queue conn..");
         this.events.removeAllListeners();
         return res.end();
      });
   }

   private async fetchOrderQueue(): Promise<OrderQueue> {
      try {
         const rawQueue = await this.orderRepository.getOrderQueue();
         return this.mapRawQueue(rawQueue);
      } catch (e) {
         console.log(e);
         throw new UnexpectedServerError("error occurred fetching queue");
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
            delivered_at,
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
               delivery_details: is_delivered ? JSON.parse(delivery_details as unknown as string) : null,
               is_delivered_asap,
               user: {
                  phone_number
               },
               delivered_at,
               cart: this.parseJsonCart(cart as unknown as string[]),
               created_at,
               total_cart_price,
               id
            };
            queue.waiting.push(mapped);
            continue;
         }
         const mapped: VerifiedQueueOrder = {
            delivered_at,
            is_delivered_asap,
            cart: this.parseJsonCart(cart as unknown as string[]),
            created_at,
            status,
            total_cart_price,
            delivery_details: is_delivered ? JSON.parse(delivery_details as unknown as string) : null,
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
      console.log(queue);
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
               o.cart = this.parseJsonCart(o.cart as unknown as string[]);
               o.delivery_details = this.parseJsonDeliveryDetails(o.delivery_details as unknown as string);
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
               o.cart = this.parseJsonCart(o.cart as unknown as string[]);
               o.delivery_details = this.parseJsonDeliveryDetails(o.delivery_details as unknown as string);
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

   async payForOrder(orderId: number): Promise<void> {
      const ok = await this.orderRepository.payForOrder(orderId);
      if (!ok) {
         throw new OrderCannotBePaid(orderId);
      }
      return;
   }

   async applyDeliveryPunishment(p: number) {
      const v: Miscellaneous = await this.miscService.getAllValues();
      if (p <= v.delivery_punishment_threshold) {
         return p + v.delivery_punishment_value;
      }

      return p;
   }

   parseJsonCart(currentCart: string[]): DatabaseCartProduct[] {
      return currentCart.map((item) => JSON.parse(item as unknown as string));
   }
   parseJsonDeliveryDetails(currentDetails: string): DeliveryDetails {
      return JSON.parse(currentDetails);
   }
}
