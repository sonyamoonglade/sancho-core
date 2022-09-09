import { pg_conn } from "../../packages/database/db_provider-name";
import { PoolClient } from "pg";
import { query_builder } from "../../packages/query_builder/provider-name";
import { QueryBuilder } from "../../packages/query_builder/QueryBuilder";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { Mark, marks } from "../entities/Mark";
import { Inject, Injectable } from "@nestjs/common";
import { MarkRepositoryInterface } from "../user/user.service";
import { REGULAR_CUSTOMER_CONTENT } from "../../../common/constants";
import { User, users } from "../entities/User";
import { orders } from "../entities/Order";

@Injectable()
export class MarkRepository implements MarkRepositoryInterface {
   constructor(@Inject(pg_conn) private db: PoolClient, @Inject(query_builder) private qb: QueryBuilder) {}

   async tryCreate(dto: CreateMarkDto): Promise<Mark> {
      const sql = `INSERT INTO ${marks} (user_id,content,is_important,created_at) VALUES ($1,$2,$3,NOW()) ON CONFLICT DO NOTHING RETURNING *`;
      const values = [dto.userId, dto.content, dto.isImportant];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return rows[0];
      }
      return null;
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

   async getUserAndMarksByOrderId(orderId: number): Promise<[User, Mark[]]> {
      const sql = `SELECT u.id as user_id, u.name, u.role, u.phone_number,
                   m.id as mark_id, m.content, m.created_at, m.is_important
                   FROM ${users} u JOIN ${orders} o ON o.user_id = u.id
                   LEFT JOIN ${marks} m on m.user_id = u.id WHERE o.id = $1`;

      const values = [orderId];
      const { rows } = await this.db.query(sql, values);

      let result: [User, Mark[]] = [null, []];

      for (let i = 0; i < rows.length; i++) {
         const it: Mark | User = rows[i];
         const u: User = {
            id: (it as any)?.user_id, // see sql
            name: (it as User)?.name,
            role: (it as User)?.role,
            phone_number: (it as User)?.phone_number
         };
         const m: Mark = {
            id: (it as any)?.mark_id, // see sql
            created_at: (it as Mark)?.created_at,
            is_important: (it as Mark)?.is_important,
            content: (it as Mark)?.content,
            user_id: (it as any)?.user_id //see sql
         };

         if (u.id) {
            //First iteration
            if (m.id) {
               if (result[0] === null) {
                  //init array of [User, Mark[]] with predefined mark
                  result = [u, [m]];
                  continue;
               }
               //Append mark to marks array
               result[1].push(m);
               continue;
            }
            //If no mark was found (id is undefined)
            result = [u, []];
         }
      }
      return result;
   }
}
