import { Inject, Injectable } from "@nestjs/common";
import { Product, products } from "../entities/Product";
import { Pool } from "pg";
import { QueryBuilder } from "../../shared/queryBuilder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/queryBuilder/provider-name";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepositoryInterface } from "./product.service";

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async getById(id: number): Promise<Product> {
      const sql = `SELECT * FROM ${products} WHERE id=${id}`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0];
      }
      return undefined;
   }
   async update(id: number, updated: Partial<Product>): Promise<number> {
      const [updateSql, values] = this.qb.ofTable(products).update<Product>({ where: { id }, set: updated, returning: ["id"] });
      const { rows }: any = await this.db.query(updateSql, values);
      if (rows.length > 0) {
         return rows[0].id;
      }
      return 0;
   }
   async getAll(): Promise<Product[]> {
      const selectSql = this.qb.ofTable(products).select<Product>();
      const { rows } = await this.db.query(selectSql);
      return rows as Product[];
   }
   async searchQuery(words: string[]): Promise<Product[]> {
      let sql: string;
      if (words.length > 1) {
         const joinedWords = words.join(" & ");
         sql = `
        select * from products where to_tsvector('russian',translate) @@ to_tsquery('russian','${joinedWords}:*') order by price desc
       `;
      } else {
         sql = `
        select * from products where to_tsvector('russian',translate) @@ to_tsquery('russian','${words[0]}:*') order by price desc
      `;
      }
      const { rows } = await this.db.query(sql);
      return rows;
   }
   async create(dto: CreateProductDto): Promise<number> {
      const sql = `INSERT INTO ${products} (category,features,name,translate,price,description)
        VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING id`;
      const values = [dto.category, dto.features, dto.name, dto.translate, dto.price, dto.description];
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
   async getCatalog(): Promise<Product[]> {
      const sql = `SELECT * FROM ${products} WHERE has_image=true AND approved=true`;
      const { rows } = await this.db.query(sql);
      return rows as unknown as Product[];
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
