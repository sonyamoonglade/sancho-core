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
   AggregationPreset,
   AggregationPresetAmounts,
   Cart,
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
   OrderDoesNotExist
} from "../../packages/exceptions/order.exceptions";

import { MiscService } from "../miscellaneous/misc.service";
import { QueueOrderRO } from "./dto/queue-order.dto";
import { Miscellaneous } from "../entities/Miscellaneous";
import { PinoLogger } from "nestjs-pino";
import { DeliveryService } from "../../packages/delivery/delivery.service";

import { DeliveryServiceUnavailable } from "../../packages/exceptions/delivery.exceptions";
import { helpers } from "../../packages/helpers/helpers";

@Injectable()
export class OrderService {
   constructor(
      private orderRepository: OrderRepository,
      private productRepository: ProductRepository,
      private miscService: MiscService,
      private logger: PinoLogger,
      private deliveryService: DeliveryService
   ) {
      this.logger.setContext(OrderService.name);
   }
   public async createUserOrder(dto: CreateUserOrderDto): Promise<number> {
      return this.orderRepository.createUserOrder(dto);
   }

   public async createMasterOrder(dto: CreateMasterOrderDto): Promise<number> {
      return this.orderRepository.createMasterOrder(dto);
   }

   public async verifyOrder(dto: VerifyOrderDto): Promise<void> {
      try {
         const { delivery_details, id } = dto;

         const prevDeliveryDetails: DeliveryDetails = await this.orderRepository.getDeliveryDetails(id);

         //Save comment (fetch from comment on order create)
         if (prevDeliveryDetails?.comment !== "" && dto.is_delivered) {
            dto.delivery_details = {
               ...delivery_details,
               comment: prevDeliveryDetails.comment
            };
         }

         await this.orderRepository.update(id, dto);
      } catch (e) {
         this.logger.error(e);
         throw new UnexpectedServerError();
      }
   }

   public async cancelOrder(dto: CancelOrderDto): Promise<void> {
      const { id } = dto; //orderId
      // User cancels
      if (!dto.cancel_explanation) {
         throw new CancelExplanationHasNotBeenProvided();
      }

      const ord = await this.orderRepository.getById(id);
      if (ord.status === OrderStatus.cancelled || ord.status === OrderStatus.completed) {
         throw new ForbiddenException("Некорректный статус заказа");
      }

      await this.orderRepository.update(ord.id, dto);

      return;
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

      const now = helpers.selectNowUTC();
      const updated: Partial<Order> = {
         completed_at: now,
         status: OrderStatus.completed
      };

      await this.orderRepository.update(order_id, updated);

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

   public async hasWaitingOrder(user_id: number, phone_number: string): Promise<{ id: number; ok: boolean }> {
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
               ok: false
            };
         }
         return {
            id: ord.id,
            ok: true
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
            ok: false
         };
      }
      return {
         id: ord.id,
         ok: true
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
      //First get list of writable connections
      const fconns = connections.filter((conn) => conn.writable);

      //If none of workers is connected - do not do anything
      if (fconns.length === 0) {
         return;
      } else {
         //Fetch the queue
         const queue = await this.fetchOrderQueue();
         const chunk = `data: ${JSON.stringify({ queue })}\n\n`;
         fconns.forEach((conn) => {
            conn.write(chunk);
         });
      }

      return;
   }

   private async fetchOrderQueue(): Promise<OrderQueue> {
      const rawQueue = await this.orderRepository.getOrderQueue();
      const mapped = this.mapRawQueue(rawQueue);

      const verifIds = mapped.verified.map((ord) => ord.id);
      try {
         const statuses = await this.deliveryService.status(verifIds);

         //If calling service for statuses has succeeded
         mapped.verified = mapped.verified.map((order) => {
            order.isRunnerNotified = statuses.find((st) => st.orderId === order.id).status;
            return order;
         });

         return mapped;
      } catch (e) {
         this.logger.error(e);
         //If failed with an error
         //If service is down for example
         if (e instanceof DeliveryServiceUnavailable) {
            //Return Queue without any information about isRunnerNotified(set default to false)
            return mapped;
         }
         //Otherwise, throw an exception
         throw e;
      }
   }

   public mapRawQueue(raw: QueueOrderRO[]): OrderQueue {
      const queue: OrderQueue = {
         waiting: [],
         verified: []
      };
      for (const rawOrder of raw) {
         const { status, is_delivered_asap, cart, delivery_details, created_at, total_cart_price, name, phone_number, is_delivered, id } = rawOrder;
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

   async getOrderCartsInTerms(from: Date, to: Date, aggregation?: AggregationPreset): Promise<Cart[]> {
      //Indicated if it did fall to switch statement
      let isDefault = true;
      switch (aggregation) {
         case AggregationPreset.WEEK:
            isDefault = false;
            let to = helpers.selectNowUTC();
            const weekAmount = AggregationPresetAmounts.get(AggregationPreset.WEEK);
            let from = helpers.subtractFrom(to, weekAmount);
            return this.orderRepository.getOrderCartsInTerms(from, to);
         default:
            break;
      }

      return this.orderRepository.getOrderCartsInTerms(from, to);
   }

   parseJsonCart(currentCart: DatabaseCartProduct[]): DatabaseCartProduct[] {
      return currentCart.map((item) => JSON.parse(item as unknown as string));
   }
}
