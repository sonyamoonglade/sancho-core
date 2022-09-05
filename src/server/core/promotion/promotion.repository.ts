import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../../packages/database/db_provider-name";
import { PoolClient } from "pg";
import { InitPromotion, promotions } from "../entities/Promotion";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class PromotionRepository {
   constructor(@Inject(pg_conn) private db: PoolClient, private logger: PinoLogger) {
      this.logger.setContext(PromotionRepository.name);
   }

   async initPromotions(): Promise<void> {
      try {
         const tx = `BEGIN`;
         await this.db.query(tx);

         //Inside tx
         {
            const q0 = `SELECT true FROM ${promotions}`;
            const { rowCount } = await this.db.query(q0);
            if (rowCount !== 0) {
               await this.db.query("ROLLBACK");
               this.logger.info("promotions already exist");
               return;
            }

            //Init first promotion
            const q = `INSERT INTO ${promotions} (main_title,sub_title,sub_text) VALUES ($1,$2,$3)`;
            const v = [InitPromotion.main_title, InitPromotion.sub_title, InitPromotion.sub_text];
            await this.db.query(q, v);

            //Init second promotion
            await this.db.query(q, v);

            this.logger.info("inserted base promotions");
            await this.db.query("COMMIT");
         }
      } catch (e) {
         await this.db.query("ROLLBACK");
         this.logger.error(`failed inserting base promotions ${e}`);
         throw e;
      }
   }
}
