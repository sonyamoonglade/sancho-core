import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { Response } from "express";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { Role } from "../../shared/decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { CreateDeliveryDto, CreateDeliveryDtoFrontend, DownloadCheckDto, DownloadCheckInput, RegisterRunnerDto } from "./dto/delivery.dto";
import { OrderService } from "../order/order.service";
import { UserService } from "../user/user.service";
import { PinoLogger } from "nestjs-pino";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";

@Controller("/delivery")
@UseGuards(AuthorizationGuard)
export class DeliveryController {
   constructor(
      private deliveryService: DeliveryService,
      private orderService: OrderService,
      private userService: UserService,
      private logger: PinoLogger
   ) {
      this.logger.setContext(DeliveryController.name);
   }

   @Post("/")
   @Role([AppRoles.worker])
   async createDelivery(@Res() res: Response, @Body() b: CreateDeliveryDtoFrontend) {
      this.logger.info(`create delivery for order ${b.order_id}`);
      try {
         //'Order' of calls is important. first call will signal if order does not exist
         const ordData = await this.orderService.prepareDataForDelivery(b.order_id);
         const usrData = await this.userService.prepareDataForDelivery(b.order_id);
         const dto: CreateDeliveryDto = {
            user: usrData,
            order: ordData
         };
         console.log("dto for delivery", dto);
         const ok = await this.deliveryService.createDelivery(dto);
         if (!ok) {
            this.logger.error("internal error occurred calling delivery microservice");
            throw new UnexpectedServerError();
         }
         this.logger.info("success call for delivery service");
         return res.status(201).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }

   @Post("/runner")
   @Role([AppRoles.master])
   async registerRunner(@Res() res: Response, @Body() b: RegisterRunnerDto) {
      try {
         this.logger.info("register runner");
         const ok = await this.deliveryService.registerRunner(b);
         if (!ok) {
            this.logger.error("internal error occurred calling delivery microservice");
            throw new UnexpectedServerError();
         }
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Post("/check")
   @Role([AppRoles.worker])
   async generateCheck(@Res() res: Response, @Body() b: DownloadCheckInput) {
      try {
         //'Order' of calls is important. first call will signal if order does not exist
         const ordData = await this.orderService.prepareDataForCheck(b.order_id);
         const usrData = await this.userService.prepareDataForCheck(b.order_id);
         const dto: DownloadCheckDto = {
            user: usrData,
            order: ordData
         };

         const buff = await this.deliveryService.downloadCheck(dto);
         res.header("Content-Type", "octet/stream");
         res.header("Connection", "keep-alive");
         res.header("Content-Disposition", `attachment; filename="check#${b.order_id}"`);
         res.write(buff);
         return res.end();
      } catch (e) {
         throw e;
      }
   }
}
