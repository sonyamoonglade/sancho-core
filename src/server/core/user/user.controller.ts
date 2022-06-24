import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { CreateMasterUserDto } from "./dto/create-master-user.dto";
import { PreventAuthedGuard } from "./guard/prevent-authed.guard";
import { LoginMasterUserDto } from "./dto/login-master-user.dto";
import { SessionService } from "../authentication/session.service";
import { AppRoles } from "../../../common/types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { extendedRequest } from "../../types/types";

@Controller("/users")
export class UserController {
   constructor(private userService: UserService, private sessionService: SessionService) {}

   @Post("/loginMaster")
   // @UseGuards(RegisterSpamGuard)
   async loginMaster(@Res() res: Response, @Body() b: LoginMasterUserDto) {
      try {
         const masterId = await this.userService.loginMaster(b);
         const SID = await this.sessionService.getSIDByUserId(masterId);
         res = this.sessionService.attachCookieToResponse(res, SID);
         return res.status(200).end();
      } catch (e) {
         // todo:
         console.log(e);

         throw e;
      }
   }

   @Get("/auth/me")
   async authMe(@Res() res: Response, @Req() req: extendedRequest) {
      try {
         const userId = req.user_id;
         const user = await this.userService.authMe(userId);
         if (user.role === AppRoles.user) {
            return res.status(200).send({ phone_number: user.phone_number });
         }
         return res.status(200).end();
      } catch (e) {
         console.log(e);

         throw e;
      }
   }
   @Post("/login")
   @UseGuards(PreventAuthedGuard)
   async login(@Res() res: Response, @Req() req: extendedRequest, @Body() b: RegisterUserDto) {
      try {
         const oldUser = await this.userService.login(b);
         if (oldUser === null) {
            const newUser = await this.userService.createUser(b);
            const SID = await this.sessionService.createSession(newUser.id);
            res = this.sessionService.attachCookieToResponse(res, SID);
            return res.status(201).end();
         }
         let SID = await this.sessionService.getSIDByUserId(oldUser.id);
         if (SID === undefined) {
            SID = await this.sessionService.createSession(oldUser.id);
         }
         res = this.sessionService.attachCookieToResponse(res, SID);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
   @Post("/registerMasterUser")
   async registerMasterUser(@Res() res: Response, @Req() req: Request, @Body() b: CreateMasterUserDto) {
      try {
         const masterUser = await this.userService.createMasterUser(b);
         const MASTER_SID = await this.sessionService.createSession(masterUser.id);
         res = this.sessionService.attachCookieToResponse(res, MASTER_SID);
         return res.status(200).end();
      } catch (e) {
         console.log(e);

         throw e;
      }
   }
}
