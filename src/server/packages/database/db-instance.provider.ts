import { Pool, PoolClient } from "pg";

require("dotenv").config();

export class DbInstanceProvider {
   public pool: Pool | PoolClient;

   private retries: number = 5;
   private retryDelay: number = 500;

   constructor(private config) {
      this.pool = new Pool({
         user: this.config.db.user,
         host: this.config.db.host,
         database: this.config.db.name,
         port: Number(this.config.db.port),
         password: process.env.DB_PASSWORD
      });
   }

   public async connect(): Promise<Pool | PoolClient> {
      try {
         await this.pool.connect();
         console.log("Connection to database has established");
         return this.pool;
      } catch (e) {
         if (this.retries == 0) {
            console.log(e);
            throw new Error("cannot establish connection");
         }
         setTimeout(async () => {
            this.retries--;
            await this.connect();
            console.log(`Connecting to database. Retries left: ${this.retries}`);
         }, this.retryDelay);
      }
   }
}
