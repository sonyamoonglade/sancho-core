import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { GetAppConfig } from "./packages/config/config";
import { UserService } from "./core/user/user.service";
import { Logger, PinoLogger } from "nestjs-pino";
import { HandleCors } from "./packages/cors/cors";
import { InitExternalSubscriptions } from "./packages/event/external";
import { EventsService } from "./packages/event/event.service";
import { PromotionService } from "./core/promotion/promotion.service";
import { InitMiscDto } from "./core/miscellaneous/dto/init-misc.dto";
import { MiscService } from "./core/miscellaneous/misc.service";

async function bootstrap() {
   //Init config
   const config = GetAppConfig();

   //Init an app
   const app = await NestFactory.create(AppModule);
   //Get logger instance
   const logger = app.get(Logger);
   app.useLogger(logger);

   const userService: UserService = app.get<UserService>(UserService);
   const eventsService: EventsService = app.get<EventsService>(EventsService);
   const promotionService: PromotionService = app.get<PromotionService>(PromotionService);
   const miscService: MiscService = app.get<MiscService>(MiscService);

   app.setGlobalPrefix("/api");
   app.use(cookieParser());
   app.enableCors({
      origin: HandleCors,
      methods: "GET,PUT,POST,DELETE,UPDATE",
      credentials: true,
      allowedHeaders: ["Content-type", "Accept", "Content-Length", "Connection"],
      preflightContinue: false
   });
   app.useGlobalPipes(new ValidationPipe());

   //Configure app port (*first option is optional. For hosting providers that setup port by their own)
   const APP_PORT = +process.env.PORT || +config.app.port;

   //Register super admin(if db empty)
   await userService.registerSuperAdmin();
   logger.log("admin is ok!");

   //Subscribe to external events (see events/contract.ts)
   InitExternalSubscriptions(logger, eventsService);
   logger.log("initialized external event subscriptions");

   await promotionService.initPromotions();
   logger.log("initialized base promotions");

   const baseMisc: InitMiscDto = {
      cancel_ban_duration: 5,
      order_creation_delay: 5,
      delivery_punishment_threshold: 300,
      delivery_punishment_value: 300,
      reg_cust_duration: 30,
      reg_cust_threshold: 5000
   };
   //If already initialized - it will do nothing
   await miscService.init(baseMisc);
   logger.log("initialized base misc");

   await app.listen(APP_PORT, () => {
      logger.log(`application is listening :${APP_PORT}`);
   });
}

bootstrap();
