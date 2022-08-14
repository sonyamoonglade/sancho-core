import { Inject, Injectable } from "@nestjs/common";
import { categories, Category } from "../entities/Category";
import { pg_conn } from "../../packages/database/db_provider-name";
import { PoolClient } from "pg";
import { CreateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryRepository {
   constructor(@Inject(pg_conn) private db: PoolClient) {}

   public async create(dto: CreateCategoryDto): Promise<void> {
      const baseRank = 1;
      try {
         //Begin tx
         await this.db.query("BEGIN");

         //Executed within tx
         {
            //Increment each category's rank by 1
            const q = `UPDATE ${categories} SET rank = rank + 1`;
            await this.db.query(q);

            //Create new category with baseRank
            const q1 = `INSERT INTO ${categories} (name, rank) VALUES($1,$2)`;
            const v1 = [dto.name, baseRank];
            await this.db.query(q1, v1);
         }
         await this.db.query("COMMIT");
      } catch (e) {
         //Rollback tx
         await this.db.query("ROLLBACK");
         throw e;
      }
   }
   public async delete(): Promise<void> {}
   public async getAll(): Promise<Category[]> {
      const sql = `SELECT * FROM ${categories}`;
      const { rows } = await this.db.query(sql);
      return rows;
   }
   public async getCategNamesSorted(): Promise<string[]> {
      const sql = `SELECT c.name as name FROM ${categories} c ORDER BY c.rank DESC`;
      const { rows } = await this.db.query(sql);
      return rows.map((c) => c.name);
   }
}
