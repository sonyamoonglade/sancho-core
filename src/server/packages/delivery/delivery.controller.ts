import { Body, Controller, Get, ParseIntPipe, Post, Query, Res, UseGuards } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { Response } from "express";
import { AuthorizationGuard } from "../../core/authorization/authorization.guard";
import { Role } from "../decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { CreateDeliveryDto, CreateDeliveryDtoFrontend, DownloadCheckDto, RegisterRunnerDto } from "./dto/delivery.dto";
import { OrderService } from "../../core/order/order.service";
import { UserService } from "../../core/user/user.service";
import { PinoLogger } from "nestjs-pino";
import { UnexpectedServerError } from "../exceptions/unexpected-errors.exceptions";

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
         await this.deliveryService.createDelivery(dto);

         this.logger.info("success call for delivery service");
         return res.status(201).end();
      } catch (e) {
         this.logger.error(e);
         throw e;
      }
   }

   @Post("/admin/runner")
   @Role([AppRoles.master])
   async registerRunner(@Res() res: Response, @Body() inp: RegisterRunnerDto) {
      try {
         this.logger.info("register runner");

         //Make sure phoneNumber format is correct
         if (inp.phone_number.startsWith("8")) {
            inp.phone_number = "+7" + inp.phone_number.substring(1, inp.phone_number.length);
         }
         const ok = await this.deliveryService.registerRunner(inp);
         if (!ok) {
            this.logger.error("internal error occurred calling delivery microservice");
            throw new UnexpectedServerError();
         }
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Get("/check")
   @Role([AppRoles.worker])
   async generateCheck(@Res() res: Response, @Query("v", ParseIntPipe) orderId: number) {
      try {
         //'Order' of calls is important. first call will signal if order does not exist
         const ordData = await this.orderService.prepareDataForCheck(orderId);
         const usrData = await this.userService.prepareDataForCheck(orderId);
         const dto: DownloadCheckDto = {
            user: usrData,
            order: ordData
         };

         const buff: Buffer = await this.deliveryService.downloadCheck(dto);
         if (!buff) {
            return res.end();
         }

         res.header("Content-Type", "octet/stream");
         res.header("Connection", "keep-alive");
         res.header("Content-Disposition", `attachment;filename="document.docx"`);

         res.write(buff);
         return res.end();
      } catch (e) {
         throw e;
      }
   }
}
