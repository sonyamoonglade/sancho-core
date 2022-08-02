import { Inject, Injectable } from "@nestjs/common";
import { CheckOrder, DeliveryOrder, LastVerifiedOrder, Order, orders } from "../entities/Order";
import { Pool } from "pg";
import { filter, QueryBuilder } from "../../packages/query_builder/QueryBuilder";
import { pg_conn } from "../../packages/database/db_provider-name";
import { query_builder } from "../../packages/query_builder/provider-name";
import { DeliveryDetails, OrderStatus, VerifiedQueueOrder } from "../../../common/types";
import { users } from "../entities/User";
import { QueueOrderDto } from "./dto/queue-order.dto";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";

@Injectable()
export class OrderRepository {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async delete(id: number): Promise<void | undefined> {
      const deleteSql = this.qb.ofTable(orders).delete<Order>({ where: { id } });
      await this.db.query(deleteSql);
   }

   async prepareDataForCheck(orderId: number): Promise<CheckOrder | null> {
      const sql = `SELECT id as order_id,delivery_details, total_cart_price, pay, is_delivered, cart FROM ${orders} WHERE id = ${orderId}`;
      const { rows } = await this.db.query(sql);
      if (rows.length === 0) {
         return null;
      }
      return rows[0];
   }

   async prepareDataForDelivery(orderId: number): Promise<DeliveryOrder | null> {
      const sql = `SELECT id as order_id,delivery_details,total_cart_price, pay, is_delivered_asap FROM ${orders} WHERE id = ${orderId}`;
      const { rows } = await this.db.query(sql);
      if (rows.length === 0) {
         return null;
      }
      return rows[0];
   }

   async getOrderSumInTerms(termsInDays: number, userId: number): Promise<number[]> {
      const sql = `
        SELECT total_cart_price FROM ${orders} WHERE status = '${OrderStatus.completed}' AND user_id = ${userId}
        AND created_at > (NOW() - INTERVAL '30DAYS') AND created_at < NOW()
      `;
      const { rows } = await this.db.query(sql);
      return rows.map((e) => e.total_cart_price);
   }

   async getUserOrderHistory(userId: number): Promise<Order[]> {
      const sql = `SELECT * FROM ${orders} o WHERE user_id=${userId} ORDER BY o.created_at DESC LIMIT 15`;
      const { rows } = await this.db.query(sql);
      return rows;
   }

   async getLastVerifiedOrder(phoneNumber: string): Promise<LastVerifiedOrder> {
      const sql = `
      SELECT o.created_at,o.id,o.status FROM ${orders} o JOIN users u ON o.user_id = u.id
      WHERE u.phone_number = '${phoneNumber}' AND o.status = '${OrderStatus.verified}'
      ORDER BY o.created_at DESC LIMIT 1    
    `;
      const { rows } = await this.db.query(sql);
      return rows[0] as unknown as LastVerifiedOrder;
   }

   async getOrderQueue(): Promise<QueueOrderDto[]> {
      const sql = `
        SELECT o.id, o.cart, o.total_cart_price, o.status, o.is_delivered, o.is_delivered_asap, o.delivery_details, o.created_at,
        u.name, u.phone_number FROM ${orders} o JOIN ${users} u ON o.user_id= 
        u.id WHERE o.status = '${OrderStatus.waiting_for_verification}' or o.status = '${OrderStatus.verified}' ORDER BY o.created_at DESC
      `;
      const { rows } = await this.db.query(sql);
      return rows;
   }

   async getById(id: number | string): Promise<Order | undefined> {
      const selectSql = this.qb.ofTable(orders).select<Order>({ where: { id: id as number } });
      const { rows } = await this.db.query(selectSql);
      return rows[0] ? (rows[0] as Order) : undefined;
   }

   async createUserOrder(dto: CreateUserOrderDto): Promise<void> {
      const strDetails = JSON.stringify(dto?.delivery_details || {});
      const sql = `
         INSERT INTO ${orders} (is_delivered,cart,delivery_details,total_cart_price,is_delivered_asap,user_id,status,pay)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      `;
      const values = [dto.is_delivered, dto.cart, strDetails, dto.total_cart_price, dto.is_delivered_asap, dto.user_id, dto.status, dto.pay];
      await this.db.query(sql, values);
      return;
   }

   async getDeliveryDetails(orderId: number): Promise<DeliveryDetails> {
      const sql = `SELECT delivery_details FROM ${orders} WHERE id = ${orderId}`;
      const { rows } = await this.db.query(sql);
      return rows[0].delivery_details as unknown as DeliveryDetails;
   }

   async createMasterOrder(dto: CreateMasterOrderDto): Promise<void> {
      const strDelDetails = JSON.stringify(dto?.delivery_details || {});
      const sql = `
         INSERT INTO ${orders} (is_delivered,cart,delivery_details,total_cart_price,is_delivered_asap,user_id,status,pay,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) 
      `;
      const values = [
         dto.is_delivered,
         dto.cart,
         strDelDetails,
         dto.total_cart_price,
         dto.is_delivered_asap,
         dto.user_id,
         OrderStatus.verified,
         dto.pay,
         dto.verified_at
      ];
      await this.db.query(sql, values);
      return;
   }

   async update(orderId: number, updated: Partial<Order>): Promise<void> {
      const [updateSql, values] = this.qb.ofTable(orders).update<Order>({ where: { id: orderId }, set: updated });
      await this.db.query(updateSql, values);
   }

   async cancel(dto: CancelOrderDto): Promise<void> {
      const sql = `UPDATE ${orders} SET cancel_explanation = $1, status = '${OrderStatus.cancelled}', cancelled_at = $2, cancelled_by = $3 WHERE id = $4`;
      const values = [dto.cancel_explanation, dto.status, dto.cancelled_at, dto.cancelled_by];
   }

   async getAll(): Promise<Order[]> {
      const selectSql = this.qb.ofTable(orders).select<Order>();
      const { rows } = await this.db.query(selectSql);
      return rows;
   }

   async get(expression: filter<Order>): Promise<Partial<Order>[]> {
      const selectSql = this.qb.ofTable(orders).select<Order>(expression);
      const { rows } = await this.db.query(selectSql);
      return rows;
   }

   async customQuery(query: string, values?: any[]): Promise<any[]> {
      const { rows } = await this.db.query(query, values);
      return rows as Order[];
   }

   async getOrderList(status: OrderStatus): Promise<VerifiedQueueOrder[]> {
      const sql = `
        SELECT o.id,o.cart,o.total_cart_price,o.status,o.is_delivered,o.delivery_details,o.created_at,
        u.name,u.phone_number,o.is_delivered_asap FROM ${orders} o JOIN ${users} u ON o.user_id= 
        u.id WHERE o.status = '${status}' ORDER BY o.created_at DESC LIMIT 15`;
      const { rows } = await this.db.query(sql);
      return rows.map((res: any) => {
         return {
            is_delivered_asap: res.is_delivered_asap,
            delivery_details: res.delivery_details,
            cart: res.cart,
            status: res.status,
            total_cart_price: res.total_cart_price,
            created_at: res.created_at,
            user: {
               name: res.name,
               phone_number: res.phone_number
            },
            is_delivered: res.is_delivered,
            id: res.id
         };
      });
   }
}
