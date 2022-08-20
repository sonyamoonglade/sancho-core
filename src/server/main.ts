import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { GetAppConfig } from "./packages/config/config";
import { UserService } from "./core/user/user.service";
import { Logger, PinoLogger } from "nestjs-pino";
import { HandleCors } from "./packages/cors/cors";
import { InitExternalCalls } from "./packages/event/external";
import { EventsService } from "./packages/event/event.service";

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
   const eventsService: EventsService = app.get<EventsService>(EventsService);

   app.setGlobalPrefix("/api");
   app.use(cookieParser());
   app.enableCors({
      origin: HandleCors,
      methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      credentials: true,
      allowedHeaders: ["Content-type", "Accept", "Content-Length", "Connection"]
   });
   app.useGlobalPipes(new ValidationPipe());
   //Configure app port (*first option is optional. For hosting providers that setup port by their own)
   const APP_PORT = Number(process.env.PORT) || Number(config.app.port);

   //Register super admin(if db empty)
   await userService.registerSuperAdmin();
   logger.log("admin is ok!");

   //Subscribe to external events (see events/contract.ts)
   InitExternalCalls(logger, eventsService);

   await app.listen(APP_PORT, () => {
      logger.log(`application is listening :${APP_PORT}`);
   });
}

bootstrap();
