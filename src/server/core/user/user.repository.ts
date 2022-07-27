import { Pool } from "pg";
import { Inject } from "@nestjs/common";
import { Repository } from "../../shared/abstract/repository";
import { CheckUser, DeliveryUser, User, users } from "../entities/User";
import { filter, QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { RepositoryException } from "../../shared/exceptions/repository.exceptions";
import { UserCredentialsDto } from "./dto/user-creds.dto";
import { AppRoles, OrderStatus } from "../../../common/types";
import { marks } from "../entities/Mark";
import { FoundUserDto } from "./dto/found-user.dto";
import { orders } from "../entities/Order";

export class UserRepository implements Repository<User> {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async prepareDataForCheck(orderId: number): Promise<CheckUser | null> {
      const sql = `
        SELECT u.phone_number, u.name as username FROM ${users} u
        JOIN ${orders} o ON o.user_id = u.id WHERE o.id = ${orderId} AND
        (o.STATUS = '${OrderStatus.completed}' OR o.status = '${OrderStatus.verified}')`;
      const { rows } = await this.db.query(sql);
      if (rows.length === 0) {
         return null;
      }
      return rows[0];
   }

   async prepareDataForDelivery(orderId: number): Promise<DeliveryUser | null> {
      const sql = `
        SELECT u.id as user_id,u.name as username,phone_number FROM ${users} u
        JOIN ${orders} o ON o.user_id = u.id WHERE o.id = ${orderId} AND
        (o.status = '${OrderStatus.completed}' OR o.status = '${OrderStatus.verified}')`;

      const { rows } = await this.db.query(sql);

      if (rows.length === 0) {
         return null;
      }

      const result: DeliveryUser = rows[0];
      const sql2 = `
        SELECT m.id,m.user_id,m.content,m.is_important,m.created_at FROM
        ${marks} m JOIN ${users} u ON m.user_id = u.id WHERE m.user_id = ${result.user_id}`;

      const { rows: rows2 } = await this.db.query(sql2);
      result.marks = rows2;

      return result;
   }

   async getUserCredentials(phoneNumber: string): Promise<Partial<UserCredentialsDto>> {
      const sql = `SELECT name, remembered_delivery_address FROM ${users} WHERE phone_number = '${phoneNumber}'`;
      const { rows } = await this.db.query(sql);
      const dto = new UserCredentialsDto();
      if (rows.length > 0) {
         dto.username = rows[0].name;
         dto.userDeliveryAddress = JSON.parse(rows[0].remembered_delivery_address);
         return dto;
      }
      return null;
   }
   async getUserRole(userId: number): Promise<AppRoles> {
      const sql = `SELECT role FROM ${users} WHERE id = ${userId}`;
      const { rows } = await this.db.query(sql);
      return rows[0].role;
   }
   async delete(id: number): Promise<void | undefined> {
      const deleteSql = this.qb.ofTable(users).delete<User>({ where: { id } });
      await this.db.query(deleteSql);
   }

   async getUsername(phoneNumber: string): Promise<string> {
      const sql = `SELECT name FROM ${users} WHERE phone_number = '${phoneNumber}'`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0].name;
      }
      return "";
   }
   async updateUsername(name: string, userId: number): Promise<void> {
      const sql = `UPDATE ${users} SET name='${name}' WHERE id = ${userId}`;
      await this.db.query(sql);
      return;
   }
   async getById(id: number | string): Promise<User | undefined> {
      const selectSql = this.qb.ofTable(users).select<User>({ where: { id: id as number } });
      const { rows } = await this.db.query(selectSql);
      return rows[0] ? (rows[0] as User) : undefined;
   }

   async save(dto: any): Promise<User | undefined> {
      const [insertSql, insertValues] = this.qb.ofTable(users).insert<User>(dto);

      const { rows } = await this.db.query(insertSql, insertValues);

      return rows[0] as unknown as User;
   }

   async registerSuperAdmin(dto: User): Promise<boolean> {
      const sql = `INSERT INTO ${users} (login,password,name,role) VALUES ($1,$2,$3,$4) ON CONFLICT (login) DO NOTHING RETURNING id`;
      const values = [dto.login, dto.password, dto.name, dto.role];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }

   async update(id: number, updated: Partial<User>): Promise<void> {
      const [updateSql, values] = this.qb.ofTable(users).update<User>({ where: { id: id }, set: updated });
      const { rows } = await this.db.query(updateSql, values);
      return;
   }

   async getAll(): Promise<User[]> {
      const selectSql = this.qb.ofTable(users).select<User>();
      const { rows } = await this.db.query(selectSql);
      return rows;
   }

   async get(expression: filter<User>): Promise<Partial<User>[]> {
      try {
         const selectSql = this.qb.ofTable(users).select<User>(expression);
         const { rows } = await this.db.query(selectSql);
         return rows;
      } catch (e) {
         throw new RepositoryException("user", e.message);
      }
   }

   customQuery(query: string): Promise<User[] | User | undefined> {
      return Promise.resolve(undefined);
   }

   async isStillRegularCustomer(durationInDays: number, markId: number): Promise<boolean> {
      const sql = `SELECT (SELECT extract(epoch FROM NOW()+INTERVAL '+4HOUR'))
                   >= (SELECT extract(epoch FROM (SELECT (SELECT created_at FROM ${marks}
                    WHERE id = ${markId}) + INTERVAL '+${durationInDays}DAYS'))::integer) as still
     `;
      const { rows } = await this.db.query(sql);
      return !rows[0].still;
   }

   async findByNumberQuery(phoneNumber: string): Promise<FoundUserDto[]> {
      const sql = `SELECT name as username,phone_number FROM ${users} where phone_number @@ to_tsquery('${phoneNumber}:*') ORDER BY name ASC`;
      const { rows } = await this.db.query(sql);
      return rows as unknown as FoundUserDto[];
   }
}
