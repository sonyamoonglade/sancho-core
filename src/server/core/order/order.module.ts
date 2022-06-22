import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../product/product.repository";
import { CookieService } from "../../shared/cookie/cookie.service";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../authentication/session.module";
import { QueryBuilderModule } from "../../shared/query_builder/qb.module";
import { DbModule } from "../../shared/database/db.module";
import { OrderAntiSpamMiddleware } from "./middleware/order.anti-spam.middleware";
import { MiscModule } from "../miscellaneous/misc.module";
import { MiscService } from "../miscellaneous/misc.service";
import { MiscRepository } from "../miscellaneous/misc.repository";

@Module({
   providers: [OrderService, OrderRepository, OrderAntiSpamMiddleware, ProductRepository, CookieService, MiscService, MiscRepository],
   controllers: [OrderController],
   imports: [DbModule, QueryBuilderModule, UserModule, SessionModule]
})
export class OrderModule implements NestModule {
   configure(consumer: MiddlewareConsumer): any {
      consumer
         .apply(OrderAntiSpamMiddleware)
         .forRoutes({ path: "order/createMasterOrder", method: RequestMethod.POST }, { path: "order/createUserOrder", method: RequestMethod.POST });
   }
}
