import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./core/user/user.module";
import { SessionMiddleware } from "./core/authentication/middleware/session.middleware";
import { UserController } from "./core/user/user.controller";
import { SessionService } from "./core/authentication/session.service";
import { SessionRepository } from "./core/authentication/session.repository";
import { ProductModule } from "./core/product/product.module";
import { OrderModule } from "./core/order/order.module";
import { ProductController } from "./core/product/product.controller";
import { OrderController } from "./core/order/order.controller";
import { OrderService } from "./core/order/order.service";
import { OrderRepository } from "./core/order/order.repository";
import { AppController } from "./app.controller";
import { CookieModule } from "./shared/cookie/cookie.module";
import { SessionModule } from "./core/authentication/session.module";
import { QueryBuilderModule } from "./shared/queryBuilder/qb.module";
import { DbModule } from "./shared/database/db.module";
import { MiscModule } from "./core/miscellaneous/misc.module";
import { MiscController } from "./core/miscellaneous/misc.controller";
import { UserService } from "./core/user/user.service";
import { ProductRepository } from "./core/product/product.repository";
import { MiscService } from "./core/miscellaneous/misc.service";
import { UserRepository } from "./core/user/user.repository";
import { MiscRepository } from "./core/miscellaneous/misc.repository";
import { CookieService } from "./shared/cookie/cookie.service";
import { ProductService } from "./core/product/product.service";
import { FileStorage } from "./shared/fileStorage/file.storage";
import { MarkRepository } from "./core/mark/mark.repository";

@Module({
   controllers: [AppController, UserController, OrderController, ProductController, MiscController],
   providers: [
      SessionMiddleware,
      SessionService,
      SessionRepository,
      OrderService,
      OrderRepository,
      UserService,
      ProductRepository,
      MiscService,
      MiscRepository,
      CookieService,
      ProductService,
      FileStorage,
      UserRepository,
      MarkRepository
   ],
   imports: [DbModule, QueryBuilderModule]
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
         .forRoutes(UserController, ProductController, OrderController, MiscController);
   }
}
