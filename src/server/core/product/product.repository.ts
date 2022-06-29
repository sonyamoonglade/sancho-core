import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "../../shared/abstract/repository";
import { Product, products } from "../entities/Product";
import { Pool } from "pg";
import { filter, QueryBuilder } from "../../shared/query_builder/QueryBuilder";
import { pg_conn } from "../../shared/database/db_provider-name";
import { query_builder } from "../../shared/query_builder/provider-name";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductRepository implements Repository<Product> {
   constructor(@Inject(query_builder) private qb: QueryBuilder, @Inject(pg_conn) private db: Pool) {}

   async delete(id: number): Promise<void | undefined> {
      const deleteSql = this.qb.ofTable(products).delete<Product>({ where: { id } });
      await this.db.query(deleteSql);
   }

   async getById(id: number | string): Promise<Product | undefined> {
      const selectSql = this.qb.ofTable(products).select<Product>({ where: { id: id as number } });
      const { rows } = await this.db.query(selectSql);
      return rows[0] as unknown as Product | undefined;
   }

   async save(dto: any): Promise<Product | undefined> {
      const [insertSql, insertValues] = this.qb.ofTable(products).insert<Product>(dto);
      const { rows } = await this.db.query(insertSql, insertValues);
      return rows[0] as unknown as Product;
   }

   async update(id: number, updated: Partial<Product>): Promise<void> {
      const [updateSql, values] = this.qb.ofTable(products).update<Product>({ where: { id }, set: updated });
      await this.db.query(updateSql, values);
      return;
   }

   async getAll(): Promise<Product[]> {
      const selectSql = this.qb.ofTable(products).select<Product>();
      const { rows } = await this.db.query(selectSql);
      return rows as Product[];
   }

   async get(expression: filter<Product>): Promise<Product[]> {
      const selectSql = this.qb.ofTable(products).select<Product>(expression);
      const { rows } = await this.db.query(selectSql);
      return rows as Product[];
   }

   async customQuery(query: string, v?: any[]): Promise<Product[]> {
      try {
         let result;
         if (v !== null) {
            result = await this.db.query(query);
         } else {
            result = await this.db.query(query, v);
         }
         const { rows } = result;
         return rows as Product[];
      } catch (e) {
         console.log(e);
      }
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

   async createProduct(dto: CreateProductDto): Promise<number> {
      const sql = `INSERT INTO ${products} (category,features,name,translate,price,description)
        VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING id`;
      const values = [dto.category, dto.features, dto.name, dto.translate, dto.price, dto.description];
      const { rows } = await this.db.query(sql, values);
      if (rows.length > 0) {
         return rows[0].id;
      }
      return 0;
   }

   async deleteProduct(id: number): Promise<number> {
      const sql = `DELETE FROM ${products} WHERE id = ${id} RETURNING id`;
      const { rows } = await this.db.query(sql);
      if (rows.length > 0) {
         return rows[0].id;
      }
      return 0;
   }
}
