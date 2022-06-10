import {Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {extendedRequest, getUserParamsInterface} from "../types/types";
import {UserService} from "./user.service";
import {Request, Response} from "express";
import {CreateMasterUserDto} from "./dto/create-master-user.dto";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {PreventAuthedGuard} from "./guard/prevent-authed.guard";
import {LoginMasterUserDto} from "./dto/login-master-user.dto";

@Controller(`${CONTROLLER_PATH_PREFIX}/users`)
export class UserController {

  constructor(private userService:UserService) {
  }




  @Post("/loginMaster")
  // @UseGuards(RegisterSpamGuard)
  loginMaster(@Res() res:Response, @Body() b: LoginMasterUserDto){
    return this.userService.loginMaster(res,b)
  }

  @Get("/auth/me")
  authMe(@Res() res:Response,@Req() req:extendedRequest) {
    return this.userService.authMe(req,res)
  }
  @Post("/login")
  @UseGuards(PreventAuthedGuard)
  login(@Res() res:Response, @Req() req:extendedRequest, @Body() b:{phone_number:string}){
    return this.userService.login(req,res,b)
  }
  // TODO: APPLY GUARD AND METHOD TO BECOME MASTER / CHECK IF SESSION BELONGS TO MASTER USER
  @Post("/registerMasterUser")
  registerMasterUser(@Res() res:Response, @Req() req:Request, @Body() b:CreateMasterUserDto){
    return this.userService.createMasterUser(req,res,b)
  }

  @Get("/getUser:phone_number")
  getUser(@Query() params:getUserParamsInterface,@Res() res: Response, @Req() req: Request){
  }

  @Put("/updateUser:phone_number")
  updateUser(@Query() params: getUserParamsInterface,@Res() res: Response, @Req() req: Request){

  }



}
