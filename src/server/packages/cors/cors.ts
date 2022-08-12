import { GetAppConfig } from "../config/config";

const err = new Error("CORS ERROR");

export function HandleCors(origin: string, cb) {
   const originsProd = ["localhost:80", "localhost:443", "http://localhost:80", "https://localhost:443"];

   const config = GetAppConfig();

   if (config.env.nodeEnv === "production") {
      if (originsProd.includes(origin)) {
         return cb(null, origin);
      }
      return cb(err, null);
   }

   return cb(null, origin);
}
