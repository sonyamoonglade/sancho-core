import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "../../shared/abstract/repository";
import {Product, products} from "../entities/Product";
import {Pool} from "pg";
import {filter, QueryBuilder} from "../../shared/query_builder/QueryBuilder";
import {pg_conn} from "../../shared/database/db_provider-name";
import {query_builder} from "../../shared/query_builder/provider-name";


@Injectable()
export class ProductRepository implements Repository<Product>{

  constructor(@Inject(query_builder) private qb:QueryBuilder,
              @Inject(pg_conn) private db:Pool) {
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
    await this.db.query(updateSql,values)
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

  async customQuery(query: string, v?: any[]): Promise<Product[]> {
    try {
      let result
      if(v !== null){
        result = await this.db.query(query)
      }else {
        result = await this.db.query(query,v)
      }
      const {rows} = result
      return rows as Product[]
    }catch (e) {
      console.log(e)
    }

  }


}