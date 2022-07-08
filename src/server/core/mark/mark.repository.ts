import { pg_conn } from "../../shared/database/db_provider-name";
import { PoolClient } from "pg";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { Mark, marks } from "../entities/Mark";
import { Inject, Injectable } from "@nestjs/common";
import { MarkRepositoryInterface } from "../user/user.service";
import { REGULAR_CUSTOMER_CONTENT } from "../../../common/constants";

@Injectable()
export class MarkRepository implements MarkRepositoryInterface {
   constructor(@Inject(pg_conn) private db: PoolClient, @Inject(query_builder) private qb: QueryBuilder) {}

   async create(dto: CreateMarkDto): Promise<Mark> {
      const sql = `INSERT INTO ${marks} (user_id,content,is_important,created_at) VALUES ($1,$2,$3,NOW()) RETURNING *`;
      const values = [dto.userId, dto.content, dto.isImportant];
      const { rows } = await this.db.query(sql, values);
      return rows[0] as unknown as Mark;
   }

   async isRegularMark(markId: number): Promise<boolean> {
      const sql = `SELECT content FROM ${marks} WHERE id = ${markId}`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0].content === REGULAR_CUSTOMER_CONTENT;
      }
      return false;
   }
   async delete(markId: number): Promise<boolean> {
      const sql = `DELETE FROM ${marks} WHERE id = $1 returning id`;
      const values = [markId];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }

   async getUserMarks(userId: number): Promise<Mark[]> {
      const sql = `SELECT * FROM ${marks} WHERE user_id = ${userId} ORDER BY is_important DESC`;
      const { rows } = await this.db.query(sql);
      return rows as unknown as Mark[];
   }
}
