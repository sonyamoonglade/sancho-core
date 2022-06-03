import {Body, Controller, Get, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {CreateMasterOrderDto, CreateUserOrderDto} from "./dto/create-order.dto";
import {OrderService} from "./order.service";
import {Response} from "express";
import {extendedRequest} from "../types/types";
import {AuthorizationGuard} from "../authentication/authorization/authorization.guard";
import {Role} from "../decorators/role/Role";
import {VerifyOrderDto} from "./dto/verify-order.dto";
import {CancelOrderDto} from "./dto/cancel-order.dto";
import {AppRoles} from "../../../common/types";
import {CanCancelGuard} from "./guard/can-cancel.guard";

@Controller(`${CONTROLLER_PATH_PREFIX}/order`)
export class OrderController {


  // we can check the role of dude who created an order and (from session)
  // if user -> status - waiting for submission
  // if any other -> status - submitted

  constructor(private orderService:OrderService) {
  }


  @Post('/createUserOrder')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.user])
  createUserOrder(@Body() dto:CreateUserOrderDto,
                  @Res() res:Response,
                  @Req() req:extendedRequest){
    return this.orderService.createUserOrder(dto,res,req)
  }

  @Post('/createMasterOrder')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.worker])
  createMasterOrder(@Res() res:Response, @Body() dto:CreateMasterOrderDto){
    return this.orderService.createMasterOrder(res,dto)
  }

  @Put('/verifyOrder')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.worker])
  verifyOrder(@Body() verificationDetails:VerifyOrderDto, @Res() res: Response){
    return this.orderService.verifyOrder(res,verificationDetails)
  }


  @Put('/cancelOrder')
  @UseGuards(AuthorizationGuard)
  @UseGuards(CanCancelGuard)
  @Role([AppRoles.worker,AppRoles.user])
  cancelOrder(@Res() res:Response,@Req() req:extendedRequest, @Body() dto:CancelOrderDto){
    return this.orderService.cancelOrder(res,req,dto)
  }

  @Get('/userOrderHistory')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.user])
  userOrderHistory(@Res() res:Response, @Req() req: extendedRequest, @Query("to", ParseIntPipe) to: number){
    return this.orderService.userOrderHistory(res,req,to)
  }




}
