import { Pool, PoolClient } from "pg";
import { AppConfig, GetAppConfig } from "../config/config";

export class DbInstanceProvider {
   private pool: Pool | PoolClient;

   private retries: number = 5;
   private retryDelay: number = 500;
   private readonly config: AppConfig;
   constructor() {
      this.config = GetAppConfig();

      this.pool = new Pool({
         user: this.config.db.user,
         host: this.config.db.host,
         database: this.config.db.name,
         port: +this.config.db.port,
         password: this.config.env.databasePassword
      });
   }

   public async connect(): Promise<PoolClient | void> {
      try {
         const conn = await this.pool.connect();
         const ok = await this.ping();
         if (!ok) {
            throw new Error("could not ping database");
         }
         console.log("Connection to database has established");
         return conn;
      } catch (e) {
         if (this.retries == 0) {
            console.error(e);
            throw new Error("cannot establish connection");
         }
         setTimeout(async () => {
            this.retries--;
            await this.connect();
            console.log(`Connecting to database. Retries left: ${this.retries}`);
         }, this.retryDelay);
      }
   }

   private async ping(): Promise<boolean> {
      console.log("pinging database");
      const res = await this.pool.query("select 1");
      const ok = res.rowCount === 1;
      console.log(`ping result: ${ok}`);
      return ok;
   }
}
