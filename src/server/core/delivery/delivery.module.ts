import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { UserService } from "../user/user.service";
import { OrderService } from "../order/order.service";

@Module({
   controllers: [DeliveryController],
   providers: [DeliveryService, UserService, OrderService],
   exports: []
})
export class DeliveryModule {}
