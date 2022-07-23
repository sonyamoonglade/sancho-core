import { Inject, Injectable } from "@nestjs/common";
import { Session, sessions } from "../entities/Session";
import { Pool } from "pg";
import { filter, QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { RepositoryException } from "../../shared/exceptions/repository.exceptions";

@Injectable()
export class SessionRepository {
   constructor(@Inject(pg_conn) private db: Pool, @Inject(query_builder) private qb: QueryBuilder) {}

   async customQuery(query: string): Promise<Session[] | Session | undefined> {
      const { rows } = await this.db.query(query);
      return rows as Session[];
   }

   async destroy(sessId: string): Promise<void> {
      const sql = `DELETE FROM ${sessions} WHERE session_id=$1`;
      const values = [sessId];
      await this.db.query(sql, values);
      return;
   }

   async getById(id: string): Promise<Session | undefined> {
      const selectSql = this.qb.ofTable(sessions).select<Session>({ where: { session_id: id } });
      const { rows } = await this.db.query(selectSql);

      return rows[0] as unknown as Session;
   }

   async save(dto: Session): Promise<Session> {
      const [insertSql, values] = this.qb.ofTable(sessions).insert<Session>(dto);
      const { rows } = await this.db.query(insertSql, values);
      return rows[0] as unknown as Session;
   }

   async destroyAndGenerate(h: string, masterId: number): Promise<void> {
      const sql2 = `DELETE FROM ${sessions} WHERE user_id = ${masterId}`;
      await this.db.query(sql2);

      const sql1 = `INSERT INTO ${sessions} (session_id,user_id) VALUES ($1,$2)`;
      const values = [h, masterId];
      await this.db.query(sql1, values);

      return;
   }

   async get(expression: filter<Session>): Promise<Session[]> {
      try {
         const selectSql = this.qb.ofTable(sessions).select<Session>(expression);
         const { rows } = await this.db.query(selectSql);
         return rows;
      } catch (e: any) {
         throw new RepositoryException("Session repository", e.message);
      }
   }
}
