import { Body, Controller, Get, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { CreateMasterOrderDto, CreateUserOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { Response } from "express";
import { VerifyOrderDto } from "./dto/verify-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { AppRoles, OrderStatus } from "../../../common/types";
import { CanCancelGuard } from "./guard/can-cancel.guard";
import { CompleteOrderDto } from "./dto/complete-order.dto";
import { CookieService } from "../../shared/cookie/cookie.service";
import { Role } from "../../shared/decorators/role/Role";
import { extendedRequest } from "../../types/types";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { UserService } from "../user/user.service";
import { User } from "../entities/User";
import { MultiWaitingOrderGuard } from "./guard/order.multi-waiting.guard";
import { CreationLimitGuard } from "./guard/order.creation-limit.guard";

@Controller("/order")
@UseGuards(AuthorizationGuard)
export class OrderController {
   constructor(private orderService: OrderService, private cookieService: CookieService, private userService: UserService) {}

   @Post("/createUserOrder")
   @UseGuards(MultiWaitingOrderGuard)
   @Role([AppRoles.user])
   async createUserOrder(@Res() res: Response, @Req() req: extendedRequest, @Body() dto: CreateUserOrderDto) {
      try {
         const userId = req.user_id;
         await this.orderService.createUserOrder(dto, userId);
         if (dto.is_delivered === true) {
            const stringDetails: string = JSON.stringify(dto.delivery_details);
            await this.userService.updateUserRememberedDeliveryAddress(userId, stringDetails);
         }
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Post("/createMasterOrder")
   @UseGuards(CreationLimitGuard)
   @Role([AppRoles.worker])
   async createMasterOrder(@Res() res: Response, @Body() dto: CreateMasterOrderDto) {
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
            const stringDetails: string = JSON.stringify(dto.delivery_details);
            await this.userService.updateUserRememberedDeliveryAddress(dto.userId, stringDetails);
         }

         return res.status(201).end();
      } catch (e) {
         console.log(e);
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
            const stringDetails: string = JSON.stringify(dto.deliveryDetails);
            await this.userService.updateUserRememberedDeliveryAddress(dto.userId, stringDetails);
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
      try {
         const userId = req.user_id;
         const role = await this.userService.getUserRole(userId);
         dto.role = role as AppRoles;
         const isCancelledByUser = await this.orderService.cancelOrder(userId, dto);
         if (isCancelledByUser) {
            // todo: set to env / config var / pg var
            const cancelBanTtl = 5;
            res = this.cookieService.setCanCancelCookie(res, cancelBanTtl);
         }
         return res.status(200).end();
      } catch (e) {
         console.log(e);
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
         console.log(e);
         throw e;
      }
   }

   @Get("/queue")
   @Role([AppRoles.worker])
   orderQueue(@Res() res: Response) {
      try {
         res.writeHead(200, {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache"
         });
         return this.orderService.orderQueue(res);
      } catch (e) {
         console.log(e);
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
         console.log(e);
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
         console.log(e);
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
         console.log(e);
         throw e;
      }
   }

   @Put("/pay")
   @Role([AppRoles.worker])
   async payForOrder(@Query("orderId", ParseIntPipe) orderId: number, @Res() res: Response) {
      try {
         await this.orderService.payForOrder(orderId);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
}
