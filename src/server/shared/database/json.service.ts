import { Injectable } from "@nestjs/common";

@Injectable()
export class JsonService {
   constructor() {}

   public stringifyNestedObjects(parent: any) {
      for (const key of Object.keys(parent)) {
         const type = typeof parent[key];

         const notArray = !Array.isArray(parent[key]);
         const notDate = !(parent[key] instanceof Date);
         const isObject = type == "object";

         if (isObject && notArray && notDate) {
            parent[key] = JSON.stringify(parent[key]);
         }
      }
      return;
   }
}
