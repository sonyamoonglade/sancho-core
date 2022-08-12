import { GetAppConfig } from "../config/config";

const err = new Error("CORS ERROR");

export function HandleCors(origin: string, cb) {
   const originsProd = ["localhost:80", "localhost:443", "http://localhost:80", "https://localhost:443", "sanchofood.ru", "https://sanchofood.ru"];
   const config = GetAppConfig();

   if (config.env.nodeEnv === "production") {
      //todo: cors
      // if (originsProd.includes(origin)) {
      //    return cb(null, origin);
      // }
      return cb(null, origin);
   }

   return cb(null, origin);
}
