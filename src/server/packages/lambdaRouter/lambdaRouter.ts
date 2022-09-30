import { Injectable } from "@nestjs/common";
import { AppConfig, GetAppConfig } from "../config/config";

@Injectable()
export class LambdaRouter {
   private config: AppConfig;
   private readonly baseUrl: string;
   constructor() {
      this.config = GetAppConfig();
      this.baseUrl = this.config.env.lambdaURL;
   }

   public PutImage(): string {
      return this.buildUrl(this.config.lambda.putFile);
   }

   public PseudoDelete(): string {
      return this.buildUrl(this.config.lambda.pseudoDelete);
   }

   buildUrl(target: string): string {
      return `${this.baseUrl}?target=${target}`;
   }
}
