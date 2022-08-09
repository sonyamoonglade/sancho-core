import { Injectable } from "@nestjs/common";
import { Cart, ProductTop, StatisticCart } from "../../../common/types";
import { Worker } from "worker_threads";
import * as path from "path";
import { PinoLogger } from "nestjs-pino";
import * as fs from "fs";
@Injectable()
export class StatisticsService {
   constructor(private logger: PinoLogger) {
      this.logger.setContext(StatisticsService.name);
   }

   mapCartsForStatistics(carts: Cart[]): StatisticCart[] {
      return carts.map((item) => {
         return item.map((entry) => {
            return {
               quantity: entry.quantity,
               translate: entry.translate
            };
         });
      });
   }

   async generateProductTop(carts: StatisticCart[]): Promise<ProductTop> {
      this.logger.info("generate product top");
      return new Promise((resolve, reject) => {
         const pathToWorkers = path.resolve("dist/server/packages/workers/topAggregator.js");
         const ok = fs.existsSync(pathToWorkers);
         this.logger.info(`worker exists: ${ok}`);

         const worker = new Worker(pathToWorkers, {
            workerData: carts
         });
         this.logger.info("spawned new worker");

         // Max timeout
         const t = setTimeout(async () => {
            await worker.terminate();
            this.logger.info("fail with timeout. Exiting");
            return reject();
         }, 5000);

         worker.on("message", (top) => {
            clearTimeout(t);
            this.logger.info("received positive response from worker");
            return resolve(top);
         });

         worker.on("error", (err) => {
            this.logger.error(`error occurred while running a worker. Exiting: ${err}`);
            return reject();
         });

         worker.on("exit", (code) => {
            //code 0 is base exit(no error)
            if (code !== 0) {
               this.logger.info(`exiting with code: ${code}`);
               reject();
            }
         });
      });
   }
}
