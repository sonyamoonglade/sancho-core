import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "../../shared/abstract/repository";
import { Order, orders } from "../entities/Order";
import { Pool } from "pg";
import { filter, QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { RepositoryException } from "../../shared/exceptions/repository.exceptions";
import { OrderStatus, VerifiedQueueOrder, WaitingQueueOrder } from "../../../common/types";
import { users } from "../entities/User";

@Injectable()
export class OrderRepository implements Repository<Order> {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async delete(id: number): Promise<void | undefined> {
      const deleteSql = this.qb.ofTable(orders).delete<Order>({ where: { id } });
      await this.db.query(deleteSql);
   }

   async getById(id: number | string): Promise<Order | undefined> {
      const selectSql = this.qb.ofTable(orders).select<Order>({ where: { id: id as number } });
      const { rows } = await this.db.query(selectSql);
      return rows[0] ? (rows[0] as Order) : undefined;
   }

   async save(dto: any): Promise<Order> {
      const [insertSql, insertValues] = this.qb.ofTable(orders).insert<Order>(dto);
      const { rows } = await this.db.query(insertSql, insertValues);

      return rows[0] as unknown as Order;
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
        o.verified_fullname,u.phone_number,o.delivered_at,o.is_delivered_asap FROM ${orders} o JOIN ${users} u ON o.user_id= 
        u.id WHERE o.status = '${status}' ORDER BY o.created_at DESC LIMIT 15`;
      const { rows } = await this.db.query(sql);
      return rows as unknown as VerifiedQueueOrder[];
   }

   async payForOrder(orderId: number): Promise<boolean> {
      const sql = `UPDATE ${orderId} SET is_paid = CASE WHEN status = '${OrderStatus.completed}' THEN true ELSE is_paid END WHERE id = ${orderId} RETURNING id`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }
}
