import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { Response } from "express";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { Role } from "../../shared/decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { CreateDeliveryDto, CreateDeliveryDtoFrontend } from "./dto/delivery.dto";
import { OrderService } from "../order/order.service";
import { UserService } from "../user/user.service";

@Controller("/delivery")
@UseGuards(AuthorizationGuard)
export class DeliveryController {
   constructor(private deliveryService: DeliveryService, private orderService: OrderService, private userService: UserService) {}

   @Post("/")
   @Role([AppRoles.worker])
   async createDelivery(@Res() res: Response, @Body() b: CreateDeliveryDtoFrontend) {
      try {
         await this.deliveryService.createDelivery(null);
         //'Order' of calls is important. first call will signal if order does not exist
         const ordData = await this.orderService.prepareDataForDelivery(b.order_id);
         const usrData = await this.userService.prepareDataForDelivery(b.order_id);
         const dto: CreateDeliveryDto = {
            user: usrData,
            order: ordData
         };
         await this.deliveryService.createDelivery(dto);
         return res.status(201).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
}
