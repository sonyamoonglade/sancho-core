import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "../../shared/abstract/repository";
import {Session, sessions} from "../entities/Session";
import {Pool} from "pg";
import {filter, QueryBuilder} from "../../shared/query_builder/QueryBuilder";
import {pg_conn} from "../../shared/database/db_provider-name";
import {query_builder} from "../../shared/query_builder/provider-name";
import {RepositoryException} from "../../shared/exceptions/repository.exceptions";


@Injectable()

export class SessionRepository implements Repository<Session> {


    constructor(@Inject(pg_conn) private db: Pool, @Inject(query_builder) private qb: QueryBuilder) {
  }

  async customQuery(query: string): Promise<Session[] | Session | undefined> {
    const {rows} = await this.db.query(query)
    return rows as Session[]
  }

  async delete(id: number | string): Promise<void> {
    const deleteSql = this.qb.ofTable(sessions).delete<Session>({ where: { session_id: id as string } });
    await this.db.query(deleteSql);
  }

  async getById(id: string): Promise<Session | undefined> {

    const selectSql =this.qb.ofTable(sessions).select<Session>({where:{session_id: id}})
    const {rows} = await this.db.query(selectSql)

    return rows[0] as unknown as Session
  }

  async save(dto: Session): Promise<Session> {

    const [insertSql, values] = this.qb.ofTable(sessions).insert<Session>(dto);
    const { rows } = await this.db.query(insertSql, values);
    return rows[0] as unknown as Session;

  }

  async update(id: number, updated: Partial<Session>): Promise<void> {
    return undefined;
  }

  async get(expression: filter<Session>): Promise<Session[]> {

    try {
      const selectSql = this.qb.ofTable(sessions).select<Session>(expression)
      const {rows} = await this.db.query(selectSql)
      return rows
    }catch (e: any) {
      throw new RepositoryException("Session repository", e.message)
    }

  }

  public getDb(){
    return this.db
  }
}