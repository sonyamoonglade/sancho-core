import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SessionMiddleware } from "./core/authentication/middleware/session.middleware";
import { UserController } from "./core/user/user.controller";
import { SessionService } from "./core/authentication/session.service";
import { SessionRepository } from "./core/authentication/session.repository";
import { ProductController } from "./core/product/product.controller";
import { OrderController } from "./core/order/order.controller";
import { OrderService } from "./core/order/order.service";
import { OrderRepository } from "./core/order/order.repository";
import { AppController } from "./app.controller";
import { QueryBuilderModule } from "./packages/query_builder/qb.module";
import { DbModule } from "./packages/database/db.module";
import { MiscController } from "./core/miscellaneous/misc.controller";
import { UserService } from "./core/user/user.service";
import { ProductRepository } from "./core/product/product.repository";
import { MiscService } from "./core/miscellaneous/misc.service";
import { UserRepository } from "./core/user/user.repository";
import { MiscRepository } from "./core/miscellaneous/misc.repository";
import { CookieService } from "./packages/cookie/cookie.service";
import { ProductService } from "./core/product/product.service";
import { MarkRepository } from "./core/mark/mark.repository";
import { DeliveryController } from "./core/delivery/delivery.controller";
import { DeliveryService } from "./core/delivery/delivery.service";
import { LoggerModule } from "nestjs-pino";
import { EventsService } from "./packages/event/event.module";
import { ImageStorageService } from "./packages/imageStorage/image_storage.service";
import { LambdaRouter } from "./packages/lambdaRouter/lambdaRouter";

@Module({
   controllers: [AppController, UserController, OrderController, ProductController, MiscController, DeliveryController],
   providers: [
      SessionMiddleware,
      SessionService,
      SessionRepository,
      OrderService,
      OrderRepository,
      UserService,
      ProductRepository,
      ImageStorageService,
      MiscService,
      MiscRepository,
      CookieService,
      ProductService,
      UserRepository,
      MarkRepository,
      DeliveryService,
      EventsService,
      LambdaRouter
   ],
   imports: [
      DbModule,
      QueryBuilderModule,
      LoggerModule.forRoot({
         pinoHttp: {
            autoLogging: false,
            quietReqLogger: true,
            level: "debug"
         }
      })
   ]
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer): any {
      consumer
         .apply(SessionMiddleware)
         .exclude(
            {
               path: "/api/v1/users/loginMaster",
               method: RequestMethod.POST
            },
            {
               path: "/api/v1/users/login",
               method: RequestMethod.POST
            },
            {
               path: "/api/v1/product/catalog",
               method: RequestMethod.GET
            },
            {
               path: "/api/v1/misc",
               method: RequestMethod.GET
            }
         )
         .forRoutes(UserController, ProductController, OrderController, MiscController, DeliveryController);
   }
}
