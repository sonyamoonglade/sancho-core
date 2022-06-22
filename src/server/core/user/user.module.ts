import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { SessionRepository } from "../authentication/session.repository";
import { SessionService } from "../authentication/session.service";
import { OrderService } from "../order/order.service";
import { OrderRepository } from "../order/order.repository";
import { ProductRepository } from "../product/product.repository";
import { CookieService } from "../../shared/cookie/cookie.service";
import { RegisterSpamGuard } from "../authentication/guard/register-spam.guard";
import { QueryBuilderModule } from "../../shared/query_builder/qb.module";
import { DbModule } from "../../shared/database/db.module";
import { MiscModule } from "../miscellaneous/misc.module";
import { MiscRepository } from "../miscellaneous/misc.repository";
import { MiscService } from "../miscellaneous/misc.service";

@Module({
   providers: [
      UserService,
      UserRepository,
      SessionService,
      SessionRepository,
      RegisterSpamGuard,
      OrderService,
      OrderRepository,
      ProductRepository,
      CookieService,
      MiscRepository,
      MiscService
   ],
   controllers: [UserController],
   imports: [DbModule, QueryBuilderModule],
   exports: [UserService]
})
export class UserModule {}
