import { Body, Controller, Get, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { CreateMasterOrderDto, CreateMasterOrderInput, CreateUserOrderDto, CreateUserOrderInput } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { Response } from "express";
import { VerifyOrderDto, VerifyOrderInput } from "./dto/verify-order.dto";
import { CancelOrderDto, CancelOrderInput } from "./dto/cancel-order.dto";
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

import { Events, InternalEvents, MasterOrderCreatePayload, UserOrderCreatePayload } from "../../packages/event/contract";
import { OrderCannotBeVerified } from "../../packages/exceptions/order.exceptions";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { helpers } from "../../packages/helpers/helpers";
import { EventsService } from "src/server/packages/event/event.service";
import { ProductService } from "../product/product.service";
import { MiscService } from "../miscellaneous/misc.service";

@Controller("/order")
@UseGuards(AuthorizationGuard)
export class OrderController {
   private queueConnections: Response[] = [];

   constructor(
      private orderService: OrderService,
      private cookieService: CookieService,
      private userService: UserService,
      private logger: PinoLogger,
      private eventService: EventsService,
      private productService: ProductService,
      private miscService: MiscService
   ) {
      this.logger.setContext(OrderController.name);
      this.initRefreshQueueSubscription();
      dayjs.extend(utc);
      dayjs.extend(timezone);
   }

   private initRefreshQueueSubscription() {
      this.eventService.Subscribe(InternalEvents.REFRESH_ORDER_QUEUE, async () => {
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
         this.logger.debug(`create order for user ${userId}`);

         let amount = await this.productService.calculateCartAmount(inp.cart);

         //Recalculate amount if order is delivered in order to apply punishment
         if (inp.is_delivered) {
            amount = await this.orderService.applyDeliveryPunishment(amount);
         }

         const filteredCart = await this.productService.filterCart(inp.cart);

         const dto: CreateUserOrderDto = {
            cart: filteredCart,
            delivery_details: inp.delivery_details,
            is_delivered: inp.is_delivered,
            is_delivered_asap: inp.is_delivered_asap,
            pay: inp.pay,
            status: OrderStatus.waiting_for_verification,
            user_id: userId,
            created_at: helpers.selectNowUTC(),
            amount
         };

         const orderId = await this.orderService.createUserOrder(dto);

         if (dto.is_delivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(userId, dto.delivery_details);
         }

         this.eventService.Fire(InternalEvents.REFRESH_ORDER_QUEUE);

         const payload: UserOrderCreatePayload = {
            amount,
            order_id: orderId
         };

         //Trigger external event
         this.eventService.FireExternal(Events.USER_ORDER_CREATE, payload);

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
   async createMasterOrder(@Res() res: Response, @Body() inp: CreateMasterOrderInput) {
      try {
         //Try get userId to check if user is in system already
         let userId = await this.userService.getUserId(inp.phone_number);
         if (userId === undefined) {
            const registeredUser: User = await this.userService.createUser({
               phone_number: inp.phone_number
            });
            userId = registeredUser.id;
         }

         let amount = await this.productService.calculateCartAmount(inp.cart);
         if (inp.is_delivered) {
            amount = await this.orderService.applyDeliveryPunishment(amount);
         }

         //Update user's name. (Do it first because orderQueue won't catch up)
         await this.userService.updateUsername(inp.username, userId);

         const filteredCart = await this.productService.filterCart(inp.cart);
         const dto: CreateMasterOrderDto = {
            cart: filteredCart,
            user_id: userId,
            verified_at: helpers.selectNowUTC(),
            created_at: helpers.selectNowUTC(),
            delivery_details: inp.delivery_details,
            delivered_at: inp.delivered_at,
            is_delivered: inp.is_delivered,
            amount,
            phone_number: inp.phone_number,
            is_delivered_asap: inp.is_delivered_asap,
            discount: inp.discount,
            discounted_amount: helpers.applyDiscount(inp.discount, amount),
            pay: "onPickup" // Only one method is allowed
         };

         this.logger.debug(`create master order for user: ${userId}`);

         const orderId = await this.orderService.createMasterOrder(dto);

         if (dto.is_delivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(userId, dto.delivery_details);
         }

         this.eventService.Fire(InternalEvents.REFRESH_ORDER_QUEUE);

         const payload: MasterOrderCreatePayload = {
            amount,
            username: inp.username,
            phone_number: inp.phone_number,
            order_id: orderId
         };
         this.eventService.FireExternal(Events.MASTER_ORDER_CREATE, payload);

         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Put("/verify")
   @Role([AppRoles.worker])
   async verifyOrder(@Res() res: Response, @Body() inp: VerifyOrderInput) {
      try {
         const userId = await this.userService.getUserId(inp.phone_number);
         const { phone_number } = inp;

         //Check if user actually has waiting order.
         const waitingOrd = await this.orderService.hasWaitingOrder(null, phone_number);
         const { id: orderId, ok } = waitingOrd;

         //Does not have waiting order
         if (!ok) {
            throw new Error(`verification ${phone_number}`);
         }

         const dto: VerifyOrderDto = {
            id: orderId, //orderId
            is_delivered_asap: inp.is_delivered_asap,
            verified_at: helpers.selectNowUTC(),
            status: OrderStatus.verified
         };

         if (inp.cart !== undefined) {
            dto.cart = await this.productService.filterCart(inp.cart);
         }
         if (inp.is_delivered !== undefined) {
            dto.is_delivered = inp.is_delivered;
         }
         if (inp.delivery_details !== undefined) {
            dto.delivery_details = inp.delivery_details;
         }
         if (dto.cart !== undefined) {
            dto.amount = await this.productService.calculateCartAmount(dto.cart);
         }
         if (inp?.discount !== 0) {
            dto.discount = inp.discount;
            let amount = dto.amount;
            if (amount === undefined) {
               const order = await this.orderService.getById(orderId);
               amount = order.amount;
            }
            dto.discounted_amount = helpers.applyDiscount(dto.discount, amount);
         }

         //Update user's name. (Do it first because orderQueue won't catch up)
         await this.userService.updateUsername(inp.username, userId);

         //Verify order
         await this.orderService.verifyOrder(dto);

         //Update user's preferred delivery details
         if (inp.is_delivered === true) {
            await this.userService.updateUserRememberedDeliveryAddress(userId, dto.delivery_details);
         }

         this.eventService.Fire(InternalEvents.REFRESH_ORDER_QUEUE);
         return res.status(200).send(OrderStatus.verified);
      } catch (e) {
         if (e.message.includes("verification")) {
            const phone = e.message.split(" ").pop();
            throw new OrderCannotBeVerified(phone);
         }
         throw e;
      }
   }

   @Put("/cancel")
   @UseGuards(CanCancelGuard)
   @Role([AppRoles.worker, AppRoles.user])
   async cancelOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() inp: CancelOrderInput) {
      try {
         const userId = req.user_id;
         const role = await this.userService.getUserRole(userId);

         const dto: CancelOrderDto = {
            id: inp.order_id,
            cancelled_by: userId,
            status: OrderStatus.cancelled,
            cancel_explanation: inp.cancel_explanation,
            cancelled_at: helpers.selectNowUTC()
         };

         await this.orderService.cancelOrder(dto);
         this.eventService.Fire(InternalEvents.REFRESH_ORDER_QUEUE);

         //If user cancels then set temp-ban cookie for it
         if (role === "user") {
            this.logger.debug("set can cancel cookie");
            const cancelBanTtl = 5;
            res = this.cookieService.setCanCancelCookie(res, cancelBanTtl);
         }

         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }

   @Put("/complete")
   @Role([AppRoles.worker])
   async completeOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() dto: CompleteOrderDto) {
      try {
         const orderStatus = await this.orderService.completeOrder(dto);
         this.eventService.Fire(InternalEvents.REFRESH_ORDER_QUEUE);

         const [user, _] = await this.userService.getUserAndMarksByOrderId(dto.order_id);

         const { reg_cust_duration, reg_cust_threshold } = await this.miscService.getAllValues();
         const termsum = await this.orderService.calculateOrderSumInTerms(reg_cust_duration, user.id);

         if (termsum >= reg_cust_threshold) {
            const m = this.userService.generateRegularCustomerMark(user.id);
            this.userService.tryCreate(m);
         }

         return res.status(200).send({ status: orderStatus as OrderStatus.completed });
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
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
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
