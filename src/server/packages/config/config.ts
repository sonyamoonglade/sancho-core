import * as fs from "fs";
import * as path from "path";
import * as yaml from 'yaml';

const nodeenv = process.env.NODE_ENV || "development";

require("dotenv").config();

export type AppConfig = {
   app: {
      port: string;
   };
   db: {
      name: string;
      user: string;
      port: string;
      host: string;
   };
   lambda: {
      putFile: string;
      pseudoDelete: string;
   };
   env: {
      superAdminLogin: string;
      superAdminPassword: string;
      databasePassword: string;
      deliveryServiceURL: string;
      notificationServiceURL: string;
      lambdaURL: string
      hashSecret: string;
      nodeEnv: string;
   };
   yandex: {
      storageURL: string;
   };
};

let instance: AppConfig;

export function GetAppConfig(): AppConfig {
   if (instance !== undefined) {
      return instance;
   }

   //Read .yaml file
   const f = readConfigFile(nodeenv);
   //Parse it with schema
   const config: AppConfig = yaml.parse(f);
   //todo: add validation
   config.env = {
      databasePassword: process.env.DB_PASSWORD,
      deliveryServiceURL: process.env.DELIVERY_SERVICE_URL,
      superAdminLogin: process.env.SUPERADMIN_LOGIN,
      superAdminPassword: process.env.SUPERADMIN_PASSWORD,
      hashSecret: process.env.HASH_SECRET,
      nodeEnv: process.env.NODE_ENV,
      notificationServiceURL: process.env.NOTIFICATION_SERVICE_URL,
      lambdaURL: process.env.LAMBDA_FILE_UPLOAD_URL
   };

   instance = config;

   return config;
}

function readConfigFile(NODE_ENV: string): string {
   const name = NODE_ENV === "production" ? "prod.config.yaml" : "config.yaml";
   const p = path.join(__dirname, "..", "..", "..", "..", name);

   if (!fs.existsSync(p)) {
      throw new Error(`config file ${name} is missing`);
   }
   return fs.readFileSync(p, { encoding: "utf8" });
}
