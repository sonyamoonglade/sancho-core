import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import { ValidationPipe } from "@nestjs/common";
import { GetAppConfig } from "./packages/config/config";
import { UserService } from "./core/user/user.service";
import { Logger } from "nestjs-pino";

require("dotenv").config({
   path: path.resolve(__dirname, ".env")
});

async function bootstrap() {
   //Init config
   const config = GetAppConfig();
   //Init an app
   const app = await NestFactory.create(AppModule);
   //Get logger instance
   const logger = app.get(Logger);
   app.useLogger(logger);

   const userService: UserService = app.get<UserService>(UserService);

   app.setGlobalPrefix("/api/v1");
   const origins = ["https://zharpizza-front.herokuapp.com", "http://localhost:3001", "http://localhost:3000"];
   app.use(cookieParser());
   app.enableCors({
      origin: origins,
      credentials: true,
      allowedHeaders: ["Set-Cookie", "Content-type", "accept"]
   });

   app.useGlobalPipes(new ValidationPipe());
   //Configure app port (*first option is optional. For hosting providers that setup port by their own)
   const APP_PORT = Number(process.env.PORT) || Number(config.app.port);

   //Register super admin(if db empty)
   await userService.registerSuperAdmin();

   await app.listen(APP_PORT, () => {
      logger.log(`application is listening :${APP_PORT}`);
   });
}

bootstrap();
