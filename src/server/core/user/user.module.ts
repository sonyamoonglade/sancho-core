import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { SessionRepository } from "../session/session.repository";
import { SessionService } from "../session/session.service";
import { OrderService } from "../order/order.service";
import { ProductRepository } from "../product/product.repository";
import { CookieService } from "../../packages/cookie/cookie.service";
import { RegisterSpamGuard } from "../session/guard/register-spam.guard";
import { QueryBuilderModule } from "../../packages/query_builder/qb.module";
import { DbModule } from "../../packages/database/db.module";
import { MiscRepository } from "../miscellaneous/misc.repository";
import { MiscService } from "../miscellaneous/misc.service";
import { MarkRepository } from "../mark/mark.repository";

@Module({
   providers: [
      UserService,
      UserRepository,
      SessionService,
      SessionRepository,
      RegisterSpamGuard,
      ProductRepository,
      CookieService,
      MiscRepository,
      MiscService,
      MarkRepository,
      OrderService
   ],
   controllers: [UserController],
   imports: [DbModule, QueryBuilderModule, MiscService],
   exports: [UserService]
})
export class UserModule {}
