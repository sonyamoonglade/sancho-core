import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../product/product.repository";
import { CookieService } from "../../shared/cookie/cookie.service";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../authentication/session.module";
import { QueryBuilderModule } from "../../shared/queryBuilder/qb.module";
import { DbModule } from "../../shared/database/db.module";
import { MultiWaitingOrderGuard } from "./guard/order.multi-waiting.guard";
import { MiscModule } from "../miscellaneous/misc.module";
import { MiscService } from "../miscellaneous/misc.service";
import { MiscRepository } from "../miscellaneous/misc.repository";
import { UserService } from "../user/user.service";

@Module({
   providers: [OrderService, OrderRepository, MultiWaitingOrderGuard, ProductRepository, CookieService, MiscService, MiscRepository, UserService],
   controllers: [OrderController],
   imports: [DbModule, QueryBuilderModule, SessionModule]
})
export class OrderModule {}
