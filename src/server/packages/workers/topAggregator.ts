import { parentPort, workerData } from "worker_threads";
import { ProductTop, ProductTopArray, StatisticCart } from "../../../common/types";

const carts: StatisticCart[] = workerData;
const top: ProductTop = new Map<string, number>();
const topArr: ProductTopArray = [];
//Calculate how many product total ( to later count %'s)
let totalProductAmount: number = 0;

for (const cart of carts) {
   for (const product of cart) {
      totalProductAmount += product.quantity;
      //Fill the Map first because it has O(1) get element time
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
//Iterate over ["mozarella",25]... in the map and Sort descending
for (const [tr, q] of Array.from(top.entries()).sort(([_, q1], [__, q2]) => q2 - q1)) {
   topArr.push({
      translate: tr,
      percent: Math.ceil(q / (totalProductAmount === 0 ? totalProductAmount : 1)), // Make sure to not divide by zero
      exactq: q
   });
}

parentPort.postMessage(topArr);
