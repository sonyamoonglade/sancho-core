import { Inject, Injectable } from "@nestjs/common";
import { FrontendProduct, Product, products } from "../entities/Product";
import { Pool } from "pg";
import { QueryBuilder } from "../../packages/query_builder/QueryBuilder";
import { pg_conn } from "../../packages/database/db_provider-name";
import { query_builder } from "../../packages/query_builder/provider-name";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepositoryInterface } from "./product.service";
import { categories } from "../entities/Category";

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async approveProduct(productId: number): Promise<boolean> {
      const sql = `UPDATE ${products} SET approved = CASE WHEN approved = false THEN true ELSE false END WHERE id = ${productId} RETURNING id`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return true;
      }
      return false;
   }

   async getById(id: number): Promise<Product> {
      const sql = `SELECT * FROM ${products} WHERE id=${id}`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0];
      }
      return undefined;
   }
   async update(id: number, updated: Partial<Product>): Promise<number> {
      const [updateSql, values] = this.qb.ofTable(products).update<Product>({ where: { id }, set: updated });
      const { rowCount }: any = await this.db.query(updateSql, values);
      return rowCount;
   }
   async getAll(): Promise<Product[]> {
      const sql = `
         SELECT p.id, p.category_id, p.features, p.name, p.translate, p.price,
         p.description, p.approved, p.currency, p.image_url, p.has_image
         FROM ${products} p JOIN ${categories} c ON p.category_id = c.category_id ORDER BY c.rank DESC
      `;
      const { rows } = await this.db.query(sql);
      return rows.map((p) => {
         return { ...p, features: JSON.parse(p.features) };
      });
   }
   async searchQuery(words: string[]): Promise<FrontendProduct[]> {
      let sql: string;
      if (words.length > 1) {
         const joinedWords = words.join(" & ");
         sql = `
         SELECT p.id, c.name as category, p.features, p.name, p.image_url, p.translate, p.price, p.description FROM ${products} p
         JOIN ${categories} c ON p.category_id = c.category_id WHERE
         to_tsvector('russian', p.translate) @@ to_tsquery('russian','${joinedWords}:*') ORDER BY p.price DESC
       `;
      } else {
         sql = `
         SELECT p.id, c.name as category, p.features, p.name, p.image_url, p.translate, p.price, p.description FROM ${products} p
         JOIN ${categories} c ON p.category_id = c.category_id WHERE
         to_tsvector('russian',p.translate) @@ to_tsquery('russian','${words[0]}:*') ORDER BY p.price DESC
      `;
      }
      const { rows } = await this.db.query(sql);
      return rows;
   }
   async create(dto: CreateProductDto): Promise<number> {
      const sql = `INSERT INTO ${products} (category_id,features,name,translate,price,description)
        VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING id`;
      const values = [dto.category_id, dto.features, dto.name, dto.translate, dto.price, dto.description];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return rows[0].id;
      }
      return 0;
   }
   async delete(id: number): Promise<number> {
      const sql = `DELETE FROM ${products} WHERE id = ${id} RETURNING id`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0].id;
      }
      return 0;
   }
   async getCatalog(): Promise<FrontendProduct[]> {
      const sql = `
        SELECT p.id, c.name as category, p.features, p.name, p.image_url, p.translate, p.price, p.description 
        FROM ${products} p JOIN ${categories} c ON p.category_id = c.category_id
        WHERE p.has_image=true AND p.approved=true ORDER BY c.rank DESC
      `;
      const { rows } = await this.db.query(sql);
      return rows.map((product) => {
         return { ...product, features: JSON.parse(product.features) };
      });
   }
   async productCountByCategory(name: string): Promise<number> {
      const sql = `SELECT p.id FROM ${products} p JOIN ${categories} c on p.category_id = c.category_id WHERE c.name = $1`;
      const v = [name];
      const { rows } = await this.db.query(sql, v);
      return rows.length;
   }
   async getProductsByIds(productIds: number[]): Promise<Product[]> {
      const key = "id";
      const statements = [];
      let i = 0;
      for (const p_id of productIds) {
         let statement;
         if (i == productIds.length - 1) {
            statement = `${key} = ${p_id}`;
         } else {
            statement = `${key} = ${p_id} or`;
         }
         i++;

         statements.push(statement);
      }
      const sql = `SELECT price,id FROM ${products} WHERE ${statements.join(" ")}`;
      const { rows } = await this.db.query(sql);

      return rows as unknown as Product[];
   }
}
