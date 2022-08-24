import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Res, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "../../core/authorization/authorization.guard";
import { AppRoles } from "../../../common/types";
import { Role } from "../decorators/role/Role";
import { Response } from "express";
import { CreateSubscriptionDto, RegisterSubscriberDto } from "./dto/event.dto";
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
         await this.eventsService.createSubscriptionAPI(inp);
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
         await this.eventsService.cancelSubscriptionAPI(subscriptionId);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }

   @Get("/subscriptions/joined")
   @Role([AppRoles.master])
   async getSubscriberJoinedData(@Res() res: Response) {
      try {
         this.logger.debug("get joined data");
         const subscribersData = await this.eventsService.getSubscribersJoinedData();
         return res.status(200).json(subscribersData);
      } catch (e) {
         throw e;
      }
   }

   @Get("/")
   @Role([AppRoles.master])
   async getAvailableEvents(@Res() res: Response) {
      try {
         this.logger.debug("get all events");
         const events = await this.eventsService.getAvailableEventsAPI();
         return res.status(200).json(events);
      } catch (e) {
         throw e;
      }
   }

   @Get("/subscriptions/subscribers")
   @Role([AppRoles.master])
   async getSubscribersWithoutSubscriptions(@Res() res: Response) {
      try {
         this.logger.debug("get subscribers without subscriptions");
         const subscribers = await this.eventsService.getAllSubscribersWithoutSubscriptions();
         return res.status(200).json(subscribers);
      } catch (e) {
         throw e;
      }
   }

   @Post("/subscriptions/subscribers")
   @Role([AppRoles.master])
   async registerSubscriber(@Res() res: Response, @Body() inp: RegisterSubscriberDto) {
      try {
         this.logger.debug("register subscriber");

         //Make sure phone number is correct
         if (inp.phone_number.startsWith("8")) {
            inp.phone_number = "+7" + inp.phone_number.substring(1, inp.phone_number.length);
         }

         await this.eventsService.registerSubscriberAPI(inp);
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }
}
