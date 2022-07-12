import { Inject, Module } from "@nestjs/common";
import { Pool, PoolClient } from "pg";
import { pg_conn } from "./db_provider-name";
import { getConfig } from "../../config/config";
import { DbInstanceProvider } from "./db-instance.provider";

require("dotenv").config();

const config = getConfig(process.env.NODE_ENV);

const instanceProvider = new DbInstanceProvider(config);

const dbProvider = {
   provide: pg_conn,
   useValue: instanceProvider.pool.connect()
};

@Module({
   providers: [dbProvider],
   exports: [dbProvider],
   imports: []
})
export class DbModule {}
