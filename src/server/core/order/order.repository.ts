import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "../../shared/abstract/repository";
import {filter, QueryBuilder} from "../query_builder/QueryBuilder";
import {Order, orders} from "../entities/Order";
import {query_builder} from "../query_builder/provider-name";
import {pg_conn} from "../database/db_provider-name";
import {PoolClient} from "pg";
import {RepositoryException} from "../exceptions/repository.exceptions";


@Injectable()

export class OrderRepository implements Repository<Order>{

  constructor(@Inject(query_builder) private qb:QueryBuilder, @Inject(pg_conn) private db:PoolClient) {
  }

  async delete(id: number): Promise<void | undefined> {
    const deleteSql = this.qb.ofTable(orders).delete<Order>({where:{id}})
    await this.db.query(deleteSql)
  }
  // todo: there it is!
  async getById(id: number | string): Promise<Order | undefined> {
    const selectSql = this.qb.ofTable(orders).select<Order>({where:{id: id as number}})
    const {rows} = await this.db.query(selectSql)
    return rows[0] ? rows[0] as Order : undefined
  }

  async save(dto: any): Promise<Order | undefined> {
    const [insertSql,insertValues] = this.qb.ofTable(orders).insert<Order>(dto)
    const {rows}  = await this.db.query(insertSql,insertValues)

    return rows[0] as unknown as Order

  }

  async update(id: number, updated: Partial<Order | undefined>): Promise<void> {
    try{
      const [updateSql,values] = this.qb.ofTable(orders).update<Order>({where:{id},set:updated})
      await this.db.query(updateSql,values)
      return
    }catch(e){
      throw new RepositoryException("order repository",e)
    }


  }

  async getAll():Promise<Order[]>{
    const selectSql = this.qb.ofTable(orders).select<Order>()
    const {rows} = await this.db.query(selectSql)
    return rows
  }

  async get(expression: filter<Order>): Promise<Order[]> {
    const selectSql = this.qb.ofTable(orders).select<Order>(expression)
    const {rows} = await this.db.query(selectSql)

    return rows
  }

  async customQuery(query: string): Promise<Order[]> {
    try {
      const {rows} = await this.db.query(query)
      return rows as Order[]
    }catch (e) {
      throw new RepositoryException('order repository', e.message)
    }

  }


}