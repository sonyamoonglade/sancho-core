import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SessionMiddleware } from "./core/session/middleware/session.middleware";
import { UserController } from "./core/user/user.controller";
import { SessionService } from "./core/session/session.service";
import { SessionRepository } from "./core/session/session.repository";
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
import { DeliveryController } from "./packages/delivery/delivery.controller";
import { DeliveryService } from "./packages/delivery/delivery.service";
import { LoggerModule } from "nestjs-pino";
import { ImageStorageService } from "./packages/imageStorage/image_storage.service";
import { LambdaRouter } from "./packages/lambdaRouter/lambdaRouter";
import { StatisticsController } from "./core/statistics/statistics.controller";
import { StatisticsService } from "./core/statistics/statistics.service";
import { CategoryService } from "./core/category/category.service";
import { CategoryRepository } from "./core/category/category.repository";
import { CategoryController } from "./core/category/category.controller";
import { EventsService } from "./packages/event/event.service";
import { EventsController } from "./packages/event/event.controller";
import { PromotionController } from "./core/promotion/promotion.controller";
import { PromotionModule } from "./core/promotion/promotion.module";
import { PromotionService } from "./core/promotion/promotion.service";
import { PromotionRepository } from "./core/promotion/promotion.repository";

@Module({
   controllers: [
      AppController,
      UserController,
      OrderController,
      ProductController,
      MiscController,
      DeliveryController,
      StatisticsController,
      CategoryController,
      EventsController,
      PromotionController
   ],
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
      LambdaRouter,
      StatisticsService,
      CategoryService,
      CategoryRepository,
      PromotionService,
      PromotionRepository
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
               path: "/api/users/loginMaster",
               method: RequestMethod.POST
            },
            {
               path: "/api/users/login",
               method: RequestMethod.POST
            },
            {
               path: "/api/product/catalog",
               method: RequestMethod.GET
            },
            {
               path: "/api/promotion",
               method: RequestMethod.GET
            },
            {
               path: "/api/misc",
               method: RequestMethod.GET
            }
         )
         .forRoutes(
            UserController,
            ProductController,
            OrderController,
            MiscController,
            DeliveryController,
            StatisticsController,
            CategoryController,
            EventsController,
            PromotionController
         );
   }
}
