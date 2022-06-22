import { Inject, Module } from "@nestjs/common";
import { Pool } from "pg";
import { pg_conn } from "./db_provider-name";
import { JsonService } from "./json.service";
import { getConfig } from "../../config/config";

require("dotenv").config();

const config = getConfig(process.env.NODE_ENV);

const dbProvider = {
   provide: pg_conn,
   useValue: new Pool({
      user: config.db.user,
      host: config.db.host,
      database: config.db.name,
      port: Number(config.db.port),
      password: process.env.DB_PASSWORD
   }).connect()
};

@Module({
   providers: [dbProvider, JsonService],
   exports: [dbProvider, JsonService],
   imports: []
})
export class DbModule {}
