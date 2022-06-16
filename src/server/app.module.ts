import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {UserModule} from "./core/user/user.module";
import {SessionMiddleware} from "./core/authentication/middleware/session.middleware";
import {UserController} from "./core/user/user.controller";
import {SessionService} from "./core/authentication/session.service";
import {SessionRepository} from "./core/authentication/session.repository";
import {ProductModule} from "./core/product/product.module";
import {OrderModule} from "./core/order/order.module";
import {ProductController} from "./core/product/product.controller";
import {OrderController} from "./core/order/order.controller";
import {OrderService} from "./core/order/order.service";
import {OrderRepository} from "./core/order/order.repository";
import {OrderAntiSpamMiddleware} from "./core/order/middleware/order.anti-spam.middleware";
import {AppController} from "./app.controller";
import {CookieModule} from "./shared/cookie/cookie.module";
import {SessionModule} from "./core/authentication/session.module";
import {QueryBuilderModule} from "./shared/query_builder/qb.module";
import {DbModule} from "./shared/database/db.module";


@Module({
  imports: [
    UserModule,DbModule,QueryBuilderModule,
    ProductModule, OrderModule,CookieModule,
    SessionModule
  ],
  controllers: [AppController],
  providers: [
    SessionMiddleware, SessionService, SessionRepository,
    OrderService, OrderRepository
  ],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(SessionMiddleware)
      .exclude(
      {path: "/api/v1/users/loginMaster", method: RequestMethod.POST},
            {path:"/api/v1/users/registerUser", method:RequestMethod.POST},
            {path:"/api/v1/users/registerMasterUser",method:RequestMethod.POST},
            {path:"/api/v1/users/login",method:RequestMethod.POST},
            {path:"/api/v1/product/catalogProducts", method:RequestMethod.GET}
      )
      .forRoutes(
        UserController,
        ProductController,
        OrderController
      )
      .apply(OrderAntiSpamMiddleware)
      .forRoutes(
    {path:"/api/v1/order/createMasterOrder",method:RequestMethod.POST},
          {path:"/api/v1/order/createUserOrder",method:RequestMethod.POST}
      )

  }



}
