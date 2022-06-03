import {Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {extendedRequest, getUserParamsInterface} from "../types/types";
import {RegisterUserDto,} from "./dto/user-details.dto";
import {UserService} from "./user.service";
import {Request, Response} from "express";
import {CreateMasterUserDto} from "./dto/create-master-user.dto";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {RegisterSpamGuard} from "../authentication/register-spam.guard";

@Controller(`${CONTROLLER_PATH_PREFIX}/users`)
export class UserController {

  constructor(private userService:UserService) {
  }


  @Post('/registerUser')
  @UseGuards(RegisterSpamGuard)
  registerUser(@Res() res:Response, @Body() registerUserDto:RegisterUserDto){
    return this.userService.createUser(res,registerUserDto)
  }

  @Get('/auth/me')
  authMe(@Res() res:Response,@Req() req:extendedRequest) {
    return this.userService.authMe(req,res)
  }

  //todo:implement user with session cant login more than 1/5min
  @Post('/login')
  login(@Res() res:Response, @Req() req:extendedRequest, @Body() body:{phone_number:string}){
    return this.userService.login(req,res,body)
  }
  // TODO: APPLY GUARD AND METHOD TO BECOME MASTER / CHECK IF SESSION BELONGS TO MASTER USER
  @Post('/registerMasterUser')
  registerMasterUser(@Res() res:Response, @Req() req:Request, @Body() createMasterUserDto:CreateMasterUserDto){
    return this.userService.createMasterUser(req,res,createMasterUserDto)
  }

  @Get('/getUser:phone_number')
  getUser(@Query() params:getUserParamsInterface,@Res() res: Response, @Req() req: Request){
  }

  @Put('/updateUser:phone_number')
  updateUser(@Query() params: getUserParamsInterface,@Res() res: Response, @Req() req: Request){

  }



}
