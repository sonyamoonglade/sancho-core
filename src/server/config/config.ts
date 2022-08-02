import * as yaml from "yaml";
import * as fs from "fs";
import * as path from "path";

export type ConfigSchema = {
   app: {
      port: string;
   };
   db: {
      name: string;
      user: string;
      port: string;
      host: string;
   };
};

let instance: ConfigSchema;

export function getConfig(nodeenv: string): ConfigSchema {
   if (instance !== undefined) {
      return instance;
   }
   //todo: prod config
   if (nodeenv === "production") {
      return null;
   }

   //Read .yaml file
   const f = readConfigFile();
   //Parse it with schema
   const config: ConfigSchema = yaml.parse(f);
   instance = config;
   return config;
}

function readConfigFile(): string {
   const name = "config.yaml";
   const p = path.join(__dirname, "..", "..", "..", name);

   if (!fs.existsSync(p)) {
      throw new Error("config is file missing");
   }
   return fs.readFileSync(p, { encoding: "utf8" });
}
