import { Pool } from "pg";
import { Inject } from "@nestjs/common";
import { Repository } from "../../shared/abstract/repository";
import { User, users } from "../entities/User";
import { filter, QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { RepositoryException } from "../../shared/exceptions/repository.exceptions";
import { UserCredentialsDto } from "./dto/user-creds.dto";

export class UserRepository implements Repository<User> {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async getUserCredentials(phoneNumber: string): Promise<UserCredentialsDto | null> {
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
      console.log(rows);
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

   public getDb() {
      return this.db;
   }
}
