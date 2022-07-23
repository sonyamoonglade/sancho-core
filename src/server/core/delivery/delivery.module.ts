import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { UserService } from "../user/user.service";
import { OrderService } from "../order/order.service";
import { EventsService } from "../../shared/event/event.module";

@Module({
   controllers: [DeliveryController, EventsService],
   providers: [DeliveryService, UserService, OrderService],
   exports: []
})
export class DeliveryModule {}
