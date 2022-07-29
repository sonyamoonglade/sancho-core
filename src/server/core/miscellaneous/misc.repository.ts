import { Inject, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { pg_conn } from "../../packages/database/db_provider-name";
import { InitMiscDto } from "./dto/init-misc.dto";
import { query_builder } from "../../packages/query_builder/provider-name";
import { QueryBuilder } from "../../packages/query_builder/QueryBuilder";
import { Miscellaneous } from "../entities/Miscellaneous";

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

   async init(dto: InitMiscDto): Promise<void> {
      try {
         const sql = `
                INSERT INTO misc (delivery_punishment_value, delivery_punishment_threshold,order_creation_delay,reg_cust_duration,reg_cust_threshold,cancel_ban_duration) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING
            `;
         const values = [
            dto.delivery_punishment_value,
            dto.delivery_punishment_threshold,
            dto.order_creation_delay,
            dto.reg_cust_duration,
            dto.reg_cust_threshold,
            dto.cancel_ban_duration
         ];
         await this.db.query(sql, values);
         return;
      } catch (e) {
         throw new Error("Error with database");
      }
   }

   async update(dto: InitMiscDto): Promise<void> {
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
