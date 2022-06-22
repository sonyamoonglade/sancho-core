import { Injectable } from "@nestjs/common";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";
import { UserService } from "../user/user.service";
import { OrderRepository } from "./order.repository";
import { Response } from "express";
import { Order, orders } from "../entities/Order";
import { User, users } from "../entities/User";
import { VerifyOrderDto } from "./dto/verify-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { Product, products } from "../entities/Product";
import { ProductRepository } from "../product/product.repository";
import {
   AppRoles,
   DatabaseCartProduct,
   OrderQueue,
   OrderStatus,
   ResponseUserOrder,
   VerifiedQueueOrder,
   WaitingQueueOrder
} from "../../../common/types";
import { EventEmitter } from "events";
import { CompleteOrderDto } from "./dto/complete-order.dto";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";
import { CancelExplanationHasNotBeenProvided, OrderCannotBeCompleted, OrderCannotBeVerified } from "../../shared/exceptions/order.exceptions";
import { JsonService } from "../../shared/database/json.service";
import { Events } from "../../shared/event/events";
import { MiscService } from "../miscellaneous/misc.service";
import { Miscellaneous } from "../../types/types";

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
         await this.userService.updateUsersRememberedDeliveryAddress(userId, stringDetails);
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

      const { verified_fullname, is_delivered_asap, delivery_details, is_delivered, delivered_at, cart } = createMasterOrderDto;
      const now = new Date(Date.now());
      const masterOrder: Order = {
         verified_fullname,
         is_delivered,
         cart,
         delivery_details: is_delivered ? delivery_details : null,
         total_cart_price,
         is_delivered_asap,
         user_id: userId,
         status: OrderStatus.verified,
         created_at: now,
         verified_at: now,
         delivered_at: is_delivered_asap ? now : delivered_at
      };

      if (masterOrder.is_delivered === true) {
         const stringDetails: string = JSON.stringify(masterOrder.delivery_details);
         await this.userService.updateUsersRememberedDeliveryAddress(userId, stringDetails);
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
         const { verified_fullname, delivery_details, is_delivered, cart, delivered_at, is_delivered_asap } = verifyOrderDto;
         const now = new Date(Date.now());
         const updated: Partial<Order> = {
            verified_fullname,
            delivery_details: delivery_details !== undefined ? delivery_details : null,
            status: OrderStatus.verified,
            verified_at: now,
            delivered_at,
            is_delivered_asap
         };
         if (verifyOrderDto.is_delivered !== undefined) {
            updated.is_delivered = is_delivered;
         }
         if (verifyOrderDto.cart !== undefined) {
            const recalculatedTotalCartPrice = await this.calculateTotalCartPrice(cart);
            updated.cart = cart;
            updated.total_cart_price = recalculatedTotalCartPrice;
            this.jsonService.stringifyNestedObjects(updated);
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

   public async userOrderHistory(userId: number): Promise<ResponseUserOrder[]> {
      const sql = `SELECT * FROM ${orders} o WHERE user_id=${userId} ORDER BY o.created_at ASC LIMIT 15`;

      const userOrders: Order[] = await this.orderRepository.customQuery(sql);
      console.log(userOrders);
      let mappedToResponse: ResponseUserOrder[];
      mappedToResponse = userOrders.map((o: Order) => {
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
      console.log(mappedToResponse);
      return mappedToResponse;
   }

   public async getLastVerifiedOrder(phoneNumber: string): Promise<Partial<Order> | undefined> {
      const sql = `
      SELECT o.created_at,o.id,o.status FROM ${orders} o JOIN users u ON o.user_id = u.id
      WHERE u.phone_number = '${phoneNumber}' AND o.status = '${OrderStatus.verified}'
      ORDER BY o.created_at DESC LIMIT 1    
    `;
      const ord = (await this.orderRepository.customQuery(sql))[0];
      return ord;
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
      const product_ids = [];

      for (const product of cart) {
         product_ids.push(product.id);
      }
      const key = "id";
      const statements = [];
      let i = 0;
      for (const p_id of product_ids) {
         let statement;
         if (i == product_ids.length - 1) {
            statement = `${key} = ${p_id}`;
         } else {
            statement = `${key} = ${p_id} or`;
         }
         i++;

         statements.push(statement);
      }

      const SQL = `select price,id from ${products} where ${statements.join(" ")}`;
      try {
         const products: Product[] = await this.productRepository.customQuery(SQL);
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
         const sql = `
        select o.id,o.cart,o.total_cart_price,o.status,o.is_delivered,o.delivery_details,o.created_at,
        o.verified_fullname,u.phone_number,o.delivered_at,o.is_delivered_asap from ${orders} o join ${users} u on o.user_id= 
        u.id where o.status = '${OrderStatus.waiting_for_verification}' or o.status = '${OrderStatus.verified}' order by o.created_at desc
      `;
         const result: VerifiedQueueOrder[] = await this.orderRepository.customQuery(sql);

         const queue = this.mapOrdersToQueueTypes(result);
         return queue;
      } catch (e) {
         throw new UnexpectedServerError("error occured fetching queue");
      }
   }

   public async initialQueue() {
      const queue = await this.fetchOrderQueue();
      return queue;
   }

   mapOrdersToQueueTypes(orders: VerifiedQueueOrder[]): OrderQueue {
      //map waitings
      const w = orders
         .filter((o) => o.status === OrderStatus.waiting_for_verification)
         .map((o) => {
            const f: WaitingQueueOrder = {
               cart: o.cart,
               created_at: o.created_at,
               total_cart_price: o.total_cart_price,
               status: o.status,
               is_delivered: o.is_delivered,
               delivery_details: o.is_delivered ? JSON.parse(o.delivery_details as unknown as string) : null,
               id: o.id,
               phone_number: o.phone_number,
               is_delivered_asap: o.is_delivered_asap,
               delivered_at: o.delivered_at
            };
            return f;
         });
      // map verified
      const v = orders
         .filter((o) => o.status === OrderStatus.verified)
         .map((o) => {
            return {
               ...o,
               delivery_details: o.is_delivered ? JSON.parse(o.delivery_details as unknown as string) : null
            };
         });

      return {
         waiting: w,
         verified: v
      };
   }
   async applyDeliveryPunishment(p: number) {
      const v: Miscellaneous = await this.miscService.getAllValues();
      if (p <= v.delivery_punishment_threshold) {
         return p + v.delivery_punishment_value;
      }

      return p;
   }
}
