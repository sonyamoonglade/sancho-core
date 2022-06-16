import {Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {extendedRequest, getUserParamsInterface} from "../types/types";
import {UserService} from "./user.service";
import {Request, Response} from "express";
import {CreateMasterUserDto} from "./dto/create-master-user.dto";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {PreventAuthedGuard} from "./guard/prevent-authed.guard";
import {LoginMasterUserDto} from "./dto/login-master-user.dto";
import {SessionService} from "../authentication/session.service";
import {AppRoles} from "../../../common/types";

@Controller(`${CONTROLLER_PATH_PREFIX}/users`)
export class UserController {

  constructor(
      private userService:UserService,
      private sessionService: SessionService
  ) {
  }



  @Post("/loginMaster")
  // @UseGuards(RegisterSpamGuard)
  async loginMaster(@Res() res:Response, @Body() b: LoginMasterUserDto){
   try {
     const masterId = await this.userService.loginMaster(b)
     const SID = await this.sessionService.getSIDByUserId(masterId)
     this.sessionService.attachCookieToResponse(res,SID)
     return res.status(200).end()
   }catch (e) {
     // todo:
     throw e
   }
  }

  @Get("/auth/me")
  async authMe(@Res() res:Response,@Req() req:extendedRequest) {
    try {
      const userId = req.user_id
      const user = await this.userService.authMe(userId)
      if(user.role === AppRoles.user){
        return res.status(200).send({phone_number:user.phone_number})
      }
      return res.status(200).end()
    }catch (e) {
        throw e
    }
  }
  @Post("/login")
  @UseGuards(PreventAuthedGuard)
  async login(@Res() res:Response, @Req() req:extendedRequest, @Body() b:{phone_number:string}){
    const user = await this.userService.login(b)
    const SID = await this.sessionService.getSIDByUserId(user.id)
    this.sessionService.attachCookieToResponse(res,SID)

    return res.status(200).end()
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
