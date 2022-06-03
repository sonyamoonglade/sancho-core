import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "../../shared/abstract/repository";
import {Product, products} from "../entities/Product";
import {query_builder} from "../query_builder/provider-name";
import {filter, QueryBuilder} from "../query_builder/QueryBuilder";
import {pg_conn} from "../database/provider-name";
import {PoolClient} from "pg";


@Injectable()
export class ProductRepository implements Repository<Product>{

  constructor(@Inject(query_builder) private qb:QueryBuilder,
              @Inject(pg_conn) private db:PoolClient) {
  }

  async delete(id: number): Promise<void | undefined> {
    const deleteSql = this.qb.ofTable(products).delete<Product>({where:{id}})
    await this.db.query(deleteSql)
  }

  async getById(id: number | string): Promise<Product | undefined> {
    const selectSql = this.qb.ofTable(products).select<Product>({where:{id: id as number}})
    const {rows} = await this.db.query(selectSql)
    return rows[0] as unknown as (Product | undefined)
  }

  async save(dto: any): Promise<Product | undefined> {
    const [insertSql,insertValues] = this.qb.ofTable(products).insert<Product>(dto)
    const {rows}  = await this.db.query(insertSql,insertValues)
    return rows[0] as unknown as Product
  }

  async update(id: number, updated: Partial<Product>): Promise<void> {
    const [updateSql,values] = this.qb.ofTable(products).update<Product>({where:{id},set:updated})
    const {rows} = await this.db.query(updateSql,values)
    return
  }

  async getAll():Promise<Product[]>{
    const selectSql = this.qb.ofTable(products).select<Product>()
    const {rows} = await this.db.query(selectSql)
    return rows as Product[]
  }

  async get(expression: filter<Product>): Promise<Product[]> {
    const selectSql = this.qb.ofTable(products).select<Product>(expression)
    const {rows} = await this.db.query(selectSql)
    return rows as Product []
  }

  async customQuery(query: string): Promise<any[]> {
    const {rows} = await this.db.query(query)
    return rows as Product[]
  }


}