import { Inject, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { pg_conn } from "../../shared/database/db_provider-name";
import { Miscellaneous } from "../../types/types";
import { SetMiscDto } from "./dto/set-misc.dto";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";

@Injectable()
export class MiscRepository {
   constructor(@Inject(pg_conn) private db: PoolClient, @Inject(query_builder) private qb: QueryBuilder) {}

   async getAll(): Promise<Miscellaneous> {
      try {
         const sql = `
                select * from misc 
            `;
         const { rows } = await this.db.query(sql);
         return rows[0];
      } catch (e) {
         throw new Error("Error with database");
      }
   }

   async init(dto: SetMiscDto): Promise<void> {
      try {
         const sql = `
                INSERT INTO misc (delivery_punishment_value, delivery_punishment_threshold,order_creation_delay) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING
            `;
         const values = [dto.delivery_punishment_value, dto.delivery_punishment_threshold, dto.order_creation_delay];
         await this.db.query(sql, values);
         return;
      } catch (e) {
         throw new Error("Error with database");
      }
   }

   async update(dto: SetMiscDto): Promise<void> {
      try {
         const constantMiscId = 1;
         const [sql, values] = this.qb.ofTable("misc").update<Miscellaneous>({ where: { id: constantMiscId }, set: dto });
         await this.db.query(sql, values);
         return;
      } catch (e) {
         throw new Error("Error with database");
      }
   }
}
