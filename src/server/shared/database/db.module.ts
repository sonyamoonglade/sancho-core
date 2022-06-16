import {Module} from "@nestjs/common";
import {Pool} from "pg";
import {pg_conn} from "./db_provider-name";
import {JsonService} from "./json.service"

require('dotenv').config()

const dbProvider= {
  provide: pg_conn,
  useValue: new Pool({
    user:process.env.DB_USERNAME,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  }).connect()
}


@Module({
  providers:[dbProvider,JsonService],
  exports:[dbProvider,JsonService]
})

export class DbModule{}