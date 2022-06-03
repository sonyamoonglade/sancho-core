import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./core/user/user.module";
import { DbModule } from "./core/database/db.module";
import { QueryBuilderModule } from "./core/query_builder/qb.module";
import { ValidationModule } from "./core/validation/validation.module";
import { SessionMiddleware } from "./core/authentication/middleware/session.middleware";
import { UserController } from "./core/user/user.controller";
import { SessionService } from "./core/authentication/session.service";
import { SessionRepository } from "./core/authentication/session.repository";
import { ProductModule } from "./core/product/product.module";
import { FileModule } from "./core/file/file.module";
import { OrderModule } from "./core/order/order.module";
import { ProductController } from "./core/product/product.controller";
import { CONTROLLER_PATH_PREFIX } from "./core/types/constants";
import { OrderController } from "./core/order/order.controller";
import { OrderService } from "./core/order/order.service";
import { OrderRepository } from "./core/order/order.repository";
import { OrderAntiSpamMiddleware } from "./core/order/middleware/order.anti-spam.middleware";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path'
import {AppController} from "./app.controller";
import {CookieModule} from "./shared/cookie/cookie.module";


@Module({
  imports: [
    UserModule,DbModule,QueryBuilderModule,
    ValidationModule,ProductModule,FileModule,
    OrderModule, ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname,'static')
    }),CookieModule
  ],
  controllers: [AppController],
  providers: [
    SessionMiddleware, SessionService,SessionRepository,
    OrderAntiSpamMiddleware,OrderService,OrderRepository,
  ],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(SessionMiddleware)
      .exclude(
    {path:`${CONTROLLER_PATH_PREFIX}/users/registerUser`, method:RequestMethod.POST},
          {path:`${CONTROLLER_PATH_PREFIX}/users/registerMasterUser`,method:RequestMethod.POST},
          {path:`${CONTROLLER_PATH_PREFIX}/users/login`,method:RequestMethod.POST},
          {path:`${CONTROLLER_PATH_PREFIX}/product/catalogProducts`, method:RequestMethod.GET}
      )
      .forRoutes(
        UserController,
        ProductController,
        OrderController
      )
      .apply(OrderAntiSpamMiddleware)
      .forRoutes(
    {path:`${CONTROLLER_PATH_PREFIX}/order/createMasterOrder`,method:RequestMethod.POST},
          {path:`${CONTROLLER_PATH_PREFIX}/order/createUserOrder`,method:RequestMethod.POST}
      )

  }

}
