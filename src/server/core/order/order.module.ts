import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {OrderRepository} from "./order.repository";
import {ProductRepository} from "../product/product.repository";
import {OrderAntiSpamMiddleware} from "./middleware/order.anti-spam.middleware";
import {CookieService} from "../../shared/cookie/cookie.service";
import {UserModule} from "../user/user.module";
import {SessionModule} from "../authentication/session.module";
import {QueryBuilderModule} from "../../shared/query_builder/qb.module";
import {DbModule} from "../../shared/database/db.module";

@Module({
  providers: [
    OrderService, OrderRepository, OrderAntiSpamMiddleware,
    ProductRepository, CookieService
  ],
  controllers: [OrderController],
  imports:[
    DbModule, QueryBuilderModule, UserModule, SessionModule
  ],
})
export class OrderModule {}
