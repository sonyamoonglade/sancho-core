import { workerData, parentPort } from "worker_threads";
import { ProductTop, StatisticCart } from "../../../common/types";

const carts: StatisticCart[] = workerData;
const top: ProductTop = new Map<string, number>();
for (const cart of carts) {
   for (const product of cart) {
      const ok = top.has(product.translate);
      if (!ok) {
         top.set(product.translate, product.quantity);
         continue;
      }
      //current quantity
      const v: number = top.get(product.translate);
      //set current quantity + from iterated product
      top.set(product.translate, v + product.quantity);
   }
}

parentPort.postMessage(top);
