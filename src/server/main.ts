import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import { ValidationPipe } from "@nestjs/common";
import { getConfig } from "./config/config";

require("dotenv").config({
   path: path.resolve(__dirname, ".env")
});

async function bootstrap() {
   const config = getConfig(process.env.NODE_ENV);
   console.log("config has initialized");
   const app = await NestFactory.create(AppModule, {
      logger: ["error"]
   });

   app.setGlobalPrefix("/api/v1");

   const origins = ["https://zharpizza-front.herokuapp.com", "http://localhost:3001", "http://localhost:3000", "http://localhost:5001"];
   app.use(cookieParser());
   app.enableCors({
      origin: origins,
      credentials: true
   });
   app.useGlobalPipes(new ValidationPipe());

   const APP_PORT = Number(config.app.port);
   await app.listen(APP_PORT, () => {
      console.log(`application is listening :${APP_PORT}`);
   });
}
bootstrap();
