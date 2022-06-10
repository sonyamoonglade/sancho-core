import {Body, Controller, Get, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {CreateMasterOrderDto, CreateUserOrderDto} from "./dto/create-order.dto";
import {OrderService} from "./order.service";
import {Response} from "express";
import {extendedRequest} from "../types/types";
import {Role} from "../decorators/role/Role";
import {VerifyOrderDto} from "./dto/verify-order.dto";
import {CancelOrderDto} from "./dto/cancel-order.dto";
import {AppRoles} from "../../../common/types";
import {CanCancelGuard} from "./guard/can-cancel.guard";
import {AuthorizationGuard} from "../authorization/authorization.guard";
import {CompleteOrderDto} from "./dto/complete-order.dto";

@Controller(`${CONTROLLER_PATH_PREFIX}/order`)
@UseGuards(AuthorizationGuard)
export class OrderController {


  constructor(private orderService:OrderService) {
  }




  @Post('/createUserOrder')
  @Role([AppRoles.user])
  createUserOrder(@Res() res:Response,
                  @Req() req:extendedRequest,
                  @Body() dto:CreateUserOrderDto){
    return this.orderService.createUserOrder(dto,res,req)
  }

  @Post('/createMasterOrder')
  @Role([AppRoles.worker])
  createMasterOrder(@Res() res:Response, @Body() dto:CreateMasterOrderDto){
    return this.orderService.createMasterOrder(res,dto)
  }

  @Put('/verify')
  @Role([AppRoles.worker])
  verifyOrder(@Res() res: Response,
              @Body() dto:VerifyOrderDto){
    return this.orderService.verifyOrder(res,dto)
  }


  @Put('/cancel')
  @UseGuards(CanCancelGuard)
  @Role([AppRoles.worker,AppRoles.user])
  cancelOrder(@Res() res:Response,
              @Req() req:extendedRequest,
              @Body() dto:CancelOrderDto){
    return this.orderService.cancelOrder(res,req,dto)
  }

  @Get('/userOrderHistory')
  @Role([AppRoles.user])
  userOrderHistory(@Res() res:Response,
                   @Req() req: extendedRequest,
                   @Query("to", ParseIntPipe) to: number){
    return this.orderService.userOrderHistory(res,req,to)
  }

  @Get("/queue")
  @Role([AppRoles.worker])
  orderQueue(@Res() res: Response){
    return this.orderService.orderQueue(res)
  }
  @Get("/initialQueue")
  @Role([AppRoles.worker])
  initialQueue(@Res() res:Response){
    return this.orderService.initialQueue(res)
  }

  @Put("/complete")
  @Role([AppRoles.worker])
  completeOrder(@Res() res:Response,
                @Req() req: extendedRequest,
                @Body() dto:CompleteOrderDto){
    return this.orderService.completeOrder(req,res,dto)
  }

}
