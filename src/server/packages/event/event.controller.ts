import { Body, Controller, Delete, Param, ParseIntPipe, Post, Res, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "../../core/authorization/authorization.guard";
import { AppRoles } from "../../../common/types";
import { Role } from "../decorators/role/Role";
import { Response } from "express";
import { CreateSubscriptionDto } from "./dto/event.dto";
import { EventsService } from "./event.service";
import { PinoLogger } from "nestjs-pino";

@Controller("/admin/event")
@UseGuards(AuthorizationGuard)
export class EventsController {
   constructor(private eventsService: EventsService, private logger: PinoLogger) {
      this.logger.setContext(EventsController.name);
   }

   @Post("/subscriptions")
   @Role([AppRoles.master])
   async createSubscription(@Res() res: Response, @Body() inp: CreateSubscriptionDto) {
      try {
         this.logger.debug("create subscription");
         await this.eventsService.CreateSubscriptionAPI(inp);
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Delete("/subscriptions/:subscriptionId")
   @Role([AppRoles.master])
   async cancelSubscription(@Res() res: Response, @Param("subscriptionId", ParseIntPipe) subscriptionId: number) {
      try {
         this.logger.debug("create subscription");
         await this.eventsService.CancelSubscriptionAPI(subscriptionId);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }
}
