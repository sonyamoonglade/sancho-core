import * as y from "yaml";
import * as fs from "fs";
import * as path from "path";

class ConfigSchema {
   app: {
      port: string;
   };
   db: {
      name: string;
      user: string;
      port: string;
      host: string;
   };
   constructor() {
      this.app = {
         port: ""
      };
      this.db = {
         name: "",
         user: "",
         port: "",
         host: ""
      };
   }
}

let instance: ConfigSchema;

export function getConfig(nodeenv: string): ConfigSchema {
   if (instance !== undefined) {
      return instance;
   }
   if (nodeenv === "production") {
      return null;
   }
   const f = readFile();
   const config: ConfigSchema = y.parse(f);
   instance = config;
   return config;
}

function readFile(): string {
   const cfgName = "config.yaml";
   const p = path.join(__dirname, "..", "..", "..", cfgName);

   if (!fs.existsSync(p)) {
      throw new Error("config is file missing");
   }
   return fs.readFileSync(p, "utf8");
}
