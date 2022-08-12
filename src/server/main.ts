import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { GetAppConfig } from "./packages/config/config";
import { UserService } from "./core/user/user.service";
import { Logger } from "nestjs-pino";

async function bootstrap() {
   //Init config
   const config = GetAppConfig();
   console.log(config);
   //Init an app
   const app = await NestFactory.create(AppModule);
   //Get logger instance
   const logger = app.get(Logger);
   app.useLogger(logger);

   const userService: UserService = app.get<UserService>(UserService);

   app.setGlobalPrefix("/api");
   const origins = ["localhost:3000", "localhost:80", "localhost:443", "http://localhost:3000", "http://localhost:80", "https://localhost:443"];
   app.use(cookieParser());
   app.enableCors({
      origin: (requestedOrigin, callback) => {
         if (origins.indexOf(requestedOrigin) !== -1) {
            callback(null, requestedOrigin);
         } else {
            callback(new Error("CORS"));
         }
      },
      methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      credentials: true,
      allowedHeaders: ["Set-Cookie", "Content-type", "accept"]
   });

   app.useGlobalPipes(new ValidationPipe());
   //Configure app port (*first option is optional. For hosting providers that setup port by their own)
   const APP_PORT = Number(process.env.PORT) || Number(config.app.port);

   //Register super admin(if db empty)
   await userService.registerSuperAdmin();
   logger.log("admin is ok!");
   await app.listen(APP_PORT, () => {
      logger.log(`application is listening :${APP_PORT}`);
   });
}

bootstrap();
