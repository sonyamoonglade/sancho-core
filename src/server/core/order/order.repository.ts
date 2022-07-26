import { Inject, Injectable } from "@nestjs/common";
import { CheckOrder, DeliveryOrder, LastVerifiedOrder, Order, orders } from "../entities/Order";
import { Pool } from "pg";
import { filter, QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { RepositoryException } from "../../shared/exceptions/repository.exceptions";
import { OrderStatus, VerifiedQueueOrder } from "../../../common/types";
import { users } from "../entities/User";
import { QueueOrderDto } from "./dto/queue-order.dto";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";

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
      const sql = `SELECT id as order_id,delivery_details,total_cart_price, pay, is_delivered_asap, is_paid FROM ${orders} WHERE id = ${orderId}`;
      const { rows } = await this.db.query(sql);
      if (rows.length === 0) {
         return null;
      }
      return rows[0];
   }

   async getOrderSumInTerms(termsInDays: number, userId: number): Promise<Partial<Order>[]> {
      const sql = `
        SELECT total_cart_price FROM ${orders} WHERE is_paid = true AND status = '${OrderStatus.completed}' AND user_id = ${userId}
        AND created_at > ((NOW() + INTERVAL '+4HOUR')- INTERVAL '30DAYS') AND created_at < (NOW() + INTERVAL '+4HOUR')
      `;
      const { rows } = await this.db.query(sql);
      return rows;
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
        select o.id,o.cart,o.total_cart_price,o.status,o.is_delivered,o.delivery_details,o.created_at,
        u.name,u.phone_number,o.is_delivered_asap,o.is_paid from ${orders} o join ${users} u on o.user_id= 
        u.id where o.status = '${OrderStatus.waiting_for_verification}' or o.status = '${OrderStatus.verified}' order by o.created_at desc
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
         INSERT INTO ${orders} (is_delivered,cart,delivery_details,total_cart_price,is_delivered_asap,user_id,status,pay,created_at)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,NOW()+INTERVAL '+4HOUR')
      `;
      const values = [dto.is_delivered, dto.cart, strDetails, dto.total_cart_price, dto.is_delivered_asap, dto.user_id, dto.status, dto.pay];
      await this.db.query(sql, values);
      return;
   }

   async createMasterOrder(dto: CreateMasterOrderDto): Promise<void> {
      //Todo: Adding time zone ( later fix to automatic )
      const strDelDetails = JSON.stringify(dto?.delivery_details || {});
      const sql = `
         INSERT INTO ${orders} (is_delivered,cart,delivery_details,total_cart_price,is_delivered_asap,user_id,status,created_at,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7, NOW()+INTERVAL '+4HOUR',NOW()+INTERVAL '+4HOUR') 
      `;
      const values = [dto.is_delivered, dto.cart, strDelDetails, dto.total_cart_price, dto.is_delivered_asap, dto.userId, OrderStatus.verified];
      await this.db.query(sql, values);
      return;
   }

   async update(id: number, updated: Partial<Order | undefined>): Promise<void> {
      try {
         const [updateSql, values] = this.qb.ofTable(orders).update<Order>({ where: { id }, set: updated });
         await this.db.query(updateSql, values);
         return;
      } catch (e) {
         throw new RepositoryException("order repository", e);
      }
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
      try {
         const { rows } = await this.db.query(query, values);

         return rows as Order[];
      } catch (e) {
         throw new RepositoryException("order repository", e.message);
      }
   }

   async getOrderList(status: OrderStatus): Promise<VerifiedQueueOrder[]> {
      const sql = `
        SELECT o.id,o.cart,o.total_cart_price,o.status,o.is_delivered,o.delivery_details,o.created_at,
        u.name,u.phone_number,o.is_delivered_asap,o.is_paid FROM ${orders} o JOIN ${users} u ON o.user_id= 
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
            id: res.id,
            is_paid: res.is_paid
         };
      });
   }

   async payForOrder(orderId: number): Promise<boolean> {
      const sql = `UPDATE ${orders} SET is_paid = CASE WHEN is_paid = false THEN true ELSE false END WHERE id = ${orderId} AND status = '${OrderStatus.completed}'  RETURNING id`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }
}
