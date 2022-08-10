import { Module } from "@nestjs/common";
import { pg_conn } from "./db_provider-name";
import { DbInstanceProvider } from "./db-instance.provider";

const instanceProvider = new DbInstanceProvider();

const dbProvider = {
   provide: pg_conn,
   useValue: instanceProvider.connect()
};

@Module({
   providers: [dbProvider],
   exports: [dbProvider],
   imports: []
})
export class DbModule {}
