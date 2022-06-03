import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {DbModule} from "../database/db.module";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {SessionRepository} from "../authentication/session.repository";
import {SessionService} from "../authentication/session.service";
import {ValidationModule} from "../validation/validation.module";
import {RegisterSpamGuard} from "../authentication/register-spam.guard";
import {OrderService} from "../order/order.service";
import {OrderRepository} from "../order/order.repository";
import {ProductRepository} from "../product/product.repository";
import {CookieService} from "../../shared/cookie/cookie.service";


@Module({

  providers: [
    UserService, UserRepository,SessionService,
    SessionRepository,RegisterSpamGuard, OrderService,
    OrderRepository,ProductRepository,CookieService
  ],
  controllers: [UserController],
  imports:[DbModule, QueryBuilderModule,ValidationModule],
  exports:[UserService]

})

export class UserModule {}