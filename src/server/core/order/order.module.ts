import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {DbModule} from "../database/db.module";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {UserService} from "../user/user.service";
import {ValidationService} from "../validation/validation.service";
import {OrderRepository} from "./order.repository";
import {SessionService} from "../authentication/session.service";
import {UserRepository} from "../user/user.repository";
import {SessionRepository} from "../authentication/session.repository";
import {JsonService} from "../database/json.service";
import {ProductRepository} from "../product/product.repository";
import {OrderAntiSpamMiddleware} from "./middleware/order.anti-spam.middleware";
import {CookieService} from "../../shared/cookie/cookie.service";

@Module({
  providers: [
    OrderService, UserService, ValidationService,
    OrderRepository, SessionService, UserRepository,
    SessionRepository,JsonService,OrderAntiSpamMiddleware,
    ProductRepository, CookieService
  ],
  controllers: [OrderController],
  imports:[DbModule,QueryBuilderModule],
})
export class OrderModule {}
