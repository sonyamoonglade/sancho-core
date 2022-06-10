import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderController} from './order.controller';
import {DbModule} from "../database/db.module";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {OrderRepository} from "./order.repository";
import {ProductRepository} from "../product/product.repository";
import {OrderAntiSpamMiddleware} from "./middleware/order.anti-spam.middleware";
import {CookieService} from "../../shared/cookie/cookie.service";
import {ValidationModule} from "../validation/validation.module";
import {UserModule} from "../user/user.module";
import {SessionModule} from "../authentication/session.module";

@Module({
  providers: [
    OrderService, OrderRepository, OrderAntiSpamMiddleware,
    ProductRepository, CookieService
  ],
  controllers: [OrderController],
  imports:[
    DbModule,QueryBuilderModule,ValidationModule,
    UserModule,SessionModule
  ],
})
export class OrderModule {}
