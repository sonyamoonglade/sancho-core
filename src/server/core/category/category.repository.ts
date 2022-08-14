import { Inject, Injectable } from "@nestjs/common";
import { categories, Category } from "../entities/Category";
import { pg_conn } from "../../packages/database/db_provider-name";
import { PoolClient } from "pg";
import { CreateCategoryDto } from "./dto/category.dto";
import { CategoryDoesNotExist, CategoryHasTopRank } from "../../packages/exceptions/product.exceptions";

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
   public async delete(name: string): Promise<void> {
      const sql = `DELETE FROM ${categories} WHERE name = $1`;
      const v = [name];
      await this.db.query(sql, v);
   }
   public async getAll(): Promise<Category[]> {
      const sql = `SELECT * FROM ${categories} ORDER BY rank DESC`;
      const { rows } = await this.db.query(sql);
      return rows;
   }
   public async getCategNamesSorted(): Promise<string[]> {
      const sql = `SELECT c.name FROM ${categories} c ORDER BY c.rank DESC`;
      const { rows } = await this.db.query(sql);
      return rows.map((c) => c.name);
   }
   public async rankUp(name: string): Promise<void> {
      try {
         //Begin tx
         await this.db.query("BEGIN");

         //Executed within tx
         {
            //Get current rank
            const q1 = `SELECT rank FROM ${categories} WHERE name = $1`;
            const v1 = [name];

            const currRank = (await this.db.query(q1, v1))?.rows[0]?.rank || 0;
            //Rank of category that's ahead of current
            const aheadRank = currRank + 1;

            if (currRank === 0) {
               throw new CategoryDoesNotExist(name);
            }

            //Increment rank of requested category thus 'upping' it in the catalog
            const q2 = `UPDATE ${categories} SET rank = rank + 1 WHERE name = $1`;
            await this.db.query(q2, v1);

            //Decrement rank of previous category which had rank of currRank + 1 (important to specify the name, because after q2 2(two) of categories have the same rank)
            const q3 = `UPDATE ${categories} SET rank = rank - 1 WHERE rank = $1 AND name != $2 RETURNING category_id`;
            const v3 = [aheadRank, name];
            const { rows } = await this.db.query(q3, v3);
            //Category with aheadRank has not found, meaning category is already at the top - Rollback and throw
            if (rows.length === 0) {
               await this.db.query("ROLLBACK");
               throw new CategoryHasTopRank(name);
            }
            //Commit
            await this.db.query("COMMIT");
         }
      } catch (e) {
         //Rollback
         await this.db.query("ROLLBACK");
         throw e;
      }
   }

   public async rankDown(name: string): Promise<void> {
      try {
         //Begin tx
         await this.db.query("BEGIN");

         //Executed within tx
         {
            //Get current rank
            const q1 = `SELECT rank FROM ${categories} WHERE name = $1`;
            const v1 = [name];

            const currRank = (await this.db.query(q1, v1))?.rows[0]?.rank || 0;
            //Rank of category that's behind of current
            const aheadRank = currRank - 1;

            if (currRank === 0) {
               throw new CategoryDoesNotExist(name);
            }

            //Increment rank of requested category thus 'lowering' it in the catalog
            const q2 = `UPDATE ${categories} SET rank = rank - 1 WHERE name = $1`;
            await this.db.query(q2, v1);

            //Decrement rank of previous category which had rank of currRank - 1 (important to specify the name, because after q2 2(two) of categories have the same rank)
            const q3 = `UPDATE ${categories} SET rank = rank + 1 WHERE rank = $1 AND name != $2 RETURNING category_id`;
            const v3 = [aheadRank, name];
            const { rows } = await this.db.query(q3, v3);
            //Category with aheadRank has not found, meaning category is already at the top - Rollback and throw
            if (rows.length === 0) {
               await this.db.query("ROLLBACK");
               throw new CategoryHasTopRank(name);
            }
            //Commit
            await this.db.query("COMMIT");
         }
      } catch (e) {
         //Rollback
         await this.db.query("ROLLBACK");
         throw e;
      }
   }
}
