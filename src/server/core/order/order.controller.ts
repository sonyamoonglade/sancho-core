import { Body, Controller, Get, ParseIntPipe, Post, Put, Query, Req, Res, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateMasterOrderDto, CreateUserOrderDto, CreateUserOrderInput } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { Response } from "express";
import { VerifyOrderDto } from "./dto/verify-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { AppRoles, OrderStatus } from "../../../common/types";
import { CanCancelGuard } from "./guard/can-cancel.guard";
import { CompleteOrderDto } from "./dto/complete-order.dto";
import { CookieService } from "../../packages/cookie/cookie.service";
import { Role } from "../../packages/decorators/role/Role";
import { extendedRequest } from "../../types/types";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { UserService } from "../user/user.service";
import { User } from "../entities/User";
import { MultiWaitingOrderGuard } from "./guard/order.multi-waiting.guard";
import { CreationLimitGuard } from "./guard/order.creation-limit.guard";
import { PolicyFilter } from "./filter/order.filter";
import { applyPayPolicy } from "../../packages/pay/policy";
import { PinoLogger } from "nestjs-pino";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { EventsService } from "../../packages/event/event.module";
import { Events } from "../../packages/event/events";

@Controller("/order")
@UseGuards(AuthorizationGuard)
export class OrderController {
   private queueConnections: Response[] = [];

   constructor(
      private orderService: OrderService,
      private cookieService: CookieService,
      private userService: UserService,
      private logger: PinoLogger,
      private eventService: EventsService
   ) {
      this.logger.setContext(OrderController.name);
      this.subscribeToEvent();
   }

   private subscribeToEvent() {
      this.eventService.GetEmitter().on(Events.REFRESH_ORDER_QUEUE, async () => {
         await this.orderService.notifyQueueSubscribers(this.queueConnections);
         this.logger.debug("notified queue subscribers");
      });
   }

   @Post("/createUserOrder")
   @UseGuards(MultiWaitingOrderGuard)
   @Role([AppRoles.user])
   @UseFilters(PolicyFilter)
   async createUserOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() inp: CreateUserOrderInput) {
      try {
         //Make sure pay is 100% valid for specific case. Throws an exception that is caught by PolicyFilter
         applyPayPolicy(inp.pay, inp.is_delivered, "user");

         //If user selects onPickup and somehow sends an email or username - error
         if (inp.pay === "onPickup" && (inp.email !== undefined || inp.username !== undefined)) {
            throw new ValidationErrorException();
         }

         const userId = req.user_id;

         const dto: CreateUserOrderDto = {
            cart: inp.cart,
            delivery_details: inp.delivery_details,
            is_delivered: inp.is_delivered,
            is_delivered_asap: inp.is_delivered_asap,
            pay: inp.pay,
            status: OrderStatus.waiting_for_verification,
            user_id: userId
         };

         await this.orderService.createUserOrder(dto);

         if (dto.is_delivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(userId, dto.delivery_details);
         }

         //todo: implement online pay with redirect
         //const redirectUrl = payservice.Pay()
         // return res.status(201).send({
         //    redirect_url: redirectUrl
         // });
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Post("/createMasterOrder")
   @UseGuards(CreationLimitGuard)
   @Role([AppRoles.worker])
   @UseFilters(PolicyFilter)
   async createMasterOrder(@Res() res: Response, @Body() dto: CreateMasterOrderDto) {
      applyPayPolicy(dto.pay, dto.is_delivered, "worker");

      //Only one way to pay is onPickup if order is created by worker 'master'
      dto.pay = "onPickup";
      try {
         const userId = await this.userService.getUserId(dto.phone_number);
         if (userId === undefined) {
            const registeredUser: User = await this.userService.createUser({
               phone_number: dto.phone_number
            });
            dto.userId = registeredUser.id;
         } else {
            dto.userId = userId;
         }
         await this.userService.updateUsername(dto.username, dto.userId);
         await this.orderService.createMasterOrder(dto);
         if (dto.is_delivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(dto.userId, dto.delivery_details);
         }

         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Put("/verify")
   @Role([AppRoles.worker])
   async verifyOrder(@Res() res: Response, @Body() dto: VerifyOrderDto) {
      try {
         const userId = await this.userService.getUserId(dto.phoneNumber);
         dto.userId = userId;
         await this.userService.updateUsername(dto.username, dto.userId);
         const orderStatus = await this.orderService.verifyOrder(dto);
         if (dto.isDelivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(dto.userId, dto.deliveryDetails);
         }
         return res.status(200).send({ status: orderStatus as OrderStatus.verified });
      } catch (e) {
         throw e;
      }
   }

   @Put("/cancel")
   @UseGuards(CanCancelGuard)
   @Role([AppRoles.worker, AppRoles.user])
   async cancelOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() dto: CancelOrderDto) {
      this.logger.info("cancel order");
      try {
         const userId = req.user_id;
         const role = await this.userService.getUserRole(userId);
         dto.role = role as AppRoles;
         const isCancelledByUser = await this.orderService.cancelOrder(userId, dto);
         this.logger.debug("cancelled order");
         if (isCancelledByUser) {
            this.logger.debug("set can cancel cookie");
            // todo: set to env / config var / pg var
            const cancelBanTtl = 5;
            res = this.cookieService.setCanCancelCookie(res, cancelBanTtl);
         }
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }

   @Get("/userOrderHistory")
   @Role([AppRoles.user])
   async userOrderHistory(@Res() res: Response, @Req() req: extendedRequest) {
      try {
         const userId = req.user_id;
         const orderHistory = await this.orderService.userOrderHistory(userId);
         return res.status(200).send({ orders: orderHistory });
      } catch (e) {
         throw e;
      }
   }

   @Get("/queue")
   @Role([AppRoles.worker])
   async orderQueue(@Res() res: Response) {
      this.logger.info("+1 orderQueue connection");
      try {
         //Base headers for SSE(server sent events)
         res.writeHead(200, {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache"
         });
         //Log and end request properly
         res.on("close", () => {
            res.end();
            return;
         });
         //Append new connection and filter from closed or errored ones
         this.queueConnections = this.queueConnections.filter((conn) => conn.writable && !conn.finished).concat(res);
         this.logger.debug(`active connections: ${this.queueConnections.length}`);

         return;
      } catch (e) {
         throw e;
      }
   }

   @Get("/initialQueue")
   @Role([AppRoles.worker])
   async initialQueue(@Res() res: Response) {
      try {
         const initialQueue = await this.orderService.initialQueue();
         return res.status(200).send({ queue: initialQueue });
      } catch (e) {
         throw e;
      }
   }

   @Put("/complete")
   @Role([AppRoles.worker])
   async completeOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() dto: CompleteOrderDto) {
      try {
         const orderStatus = await this.orderService.completeOrder(dto);
         return res.status(200).send({ status: orderStatus as OrderStatus.completed });
      } catch (e) {
         throw e;
      }
   }

   @Get("/list")
   @Role([AppRoles.worker])
   async orderList(@Res() res: Response, @Req() req: extendedRequest, @Query("status") status: string) {
      try {
         const lists = await this.orderService.orderList(status as OrderStatus);
         return res.status(200).send(lists);
      } catch (e) {
         throw e;
      }
   }
}
