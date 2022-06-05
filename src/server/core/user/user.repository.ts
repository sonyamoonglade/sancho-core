import {pg_conn} from "../database/provider-name";
import {PoolClient} from "pg";
import {Inject} from "@nestjs/common";
import {filter, QueryBuilder} from "../query_builder/QueryBuilder";
import {Repository} from "../../shared/abstract/repository";
import {User, users} from "../entities/User";
import {query_builder} from "../query_builder/provider-name";
import {RepositoryException} from "../exceptions/repository.exceptions";


export class UserRepository implements Repository<User>{

  constructor(@Inject(query_builder) private qb:QueryBuilder, @Inject(pg_conn) private db:PoolClient) {
  }

  async delete(id: number): Promise<void | undefined> {
    const deleteSql = this.qb.ofTable(users).delete<User>({where:{id}})
    await this.db.query(deleteSql)
  }
  // todo: there it is!
  async getById(id: number | string): Promise<User | undefined> {
    const selectSql = this.qb.ofTable(users).select<User>({where:{id: id as number}})
    const {rows} = await this.db.query(selectSql)
    return rows[0] ? rows[0] as User : undefined
  }

  async save(dto: any): Promise<User | undefined> {
    const [insertSql,insertValues] = this.qb.ofTable(users).insert<User>(dto)

    const {rows}  = await this.db.query(insertSql,insertValues)

    return rows[0] as unknown as User

  }

  async update(id: number, updated: Partial<User | undefined>): Promise<void> {
    const [updateSql,values] = this.qb.ofTable(users).update<User>({where:{id:id},set:updated})
    const {rows} = await this.db.query(updateSql,values)
    return
  }

  async getAll():Promise<User[]>{
    const selectSql = this.qb.ofTable(users).select<User>()
    const {rows} = await this.db.query(selectSql)
    return rows
  }

  async get(expression: filter<User>): Promise<Partial<User>[]> {
    try {
      const selectSql = this.qb.ofTable(users).select<User>(expression)
      const {rows} = await this.db.query(selectSql)
      return rows
    }catch (e) {
      throw new RepositoryException("user",e.message)
    }

  }

  customQuery(query: string): Promise<User[] | User | undefined> {
    return Promise.resolve(undefined);
  }


}