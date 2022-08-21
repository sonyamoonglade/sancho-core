import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { UserService } from "../../core/user/user.service";
import { OrderService } from "../../core/order/order.service";
import { EventsService } from "../event/event.service";

@Module({
   controllers: [DeliveryController, EventsService],
   providers: [DeliveryService, UserService, OrderService],
   exports: []
})
export class DeliveryModule {}
