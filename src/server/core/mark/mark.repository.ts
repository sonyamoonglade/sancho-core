import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../../shared/database/db_provider-name";
import { PoolClient } from "pg";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { MarkRepositoryInterface } from "./mark.service";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { Mark, marks } from "../entities/Mark";

@Injectable()
export class MarkRepository implements MarkRepositoryInterface {
   constructor(@Inject(pg_conn) private db: PoolClient, @Inject(query_builder) private qb: QueryBuilder) {}

   async create(dto: CreateMarkDto): Promise<void> {
      const sql = `INSERT INTO ${marks} (user_id,content,is_important) values ($1,$2,$3)`;
      const values = [dto.userId, dto.content, dto.isImportant];
      await this.db.query(sql, values);
      return;
   }

   async delete(userId: number, markId: number): Promise<boolean> {
      const sql = `DELETE FROM ${marks} WHERE user_id=$1 AND id = $2 returning id`;
      const values = [userId, markId];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }

   async userMarks(userId: number): Promise<Mark[]> {
      const sql = `SELECT * FROM ${marks} WHERE user_id = $1 ORDER BY is_important DESC`;
      const { rows } = await this.db.query(sql);
      return rows as unknown as Mark[];
   }
}
