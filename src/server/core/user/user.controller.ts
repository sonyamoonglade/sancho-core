import { Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { CreateMasterUserDto } from "./dto/create-master-user.dto";
import { PreventAuthedGuard } from "./guard/prevent-authed.guard";
import { LoginMasterUserDto } from "./dto/login-master-user.dto";
import { SessionService } from "../authentication/session.service";
import { AppRoles } from "../../../common/types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { CookieNames, extendedRequest } from "../../types/types";
import { Role } from "../../shared/decorators/role/Role";
import { RegisterSpamGuard } from "../authentication/guard/register-spam.guard";
import { AuthorizationGuard } from "../authorization/authorization.guard";

@Controller("/users")
export class UserController {
   constructor(private userService: UserService, private sessionService: SessionService) {}

   @Post("/loginMaster")
   @UseGuards(RegisterSpamGuard)
   async loginMaster(@Res() res: Response, @Body() b: LoginMasterUserDto) {
      try {
         const { id, role } = await this.userService.loginMaster(b);
         const SID = await this.sessionService.generateMasterSession(id);
         res = this.sessionService.putMasterSession(res, SID);
         return res.status(200).send({ role });
      } catch (e) {
         console.log(e);
         throw e;
      }
   }

   @Get("/auth/me")
   async authMe(@Res() res: Response, @Req() req: extendedRequest) {
      try {
         const userId = req.user_id;
         const user = await this.userService.authMe(userId);
         console.log(user);
         if (user.role === AppRoles.user) {
            return res.status(200).send({ phone_number: user.phone_number });
         }
         return res.status(200).send({ role: user.role });
      } catch (e) {
         console.log(e);

         throw e;
      }
   }
   @Get("/username")
   async getFullName(@Res() res: Response, @Query("phoneNumber") phoneNumber: string) {
      try {
         const username = await this.userService.getUsername(phoneNumber);
         return res.status(200).send({
            username
         });
      } catch (e) {
         console.log(e);
         throw e;
      }
   }

   @Get("/credentials")
   async getUserCredentials(@Res() res: Response, @Query("phoneNumber") phoneNumber: string) {
      try {
         const credentials = await this.userService.getUserCredentials(phoneNumber);
         if (credentials !== null) {
            return res.status(200).send({ credentials });
         }
         return res.status(404).send({
            message: "Данные о пользователе не найдены!"
         });
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
            const SID = await this.sessionService.generateSession(newUser.id);
            res = this.sessionService.putUserSession(res, SID);
            return res.status(201).end();
         }
         let SID = await this.sessionService.getSIDByUserId(oldUser.id);
         if (SID === undefined) {
            SID = await this.sessionService.generateSession(oldUser.id);
         }
         res = this.sessionService.putUserSession(res, SID);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
   @Post("/registerMasterUser")
   @UseGuards(AuthorizationGuard)
   @Role([AppRoles.master])
   async registerMasterUser(@Res() res: Response, @Req() req: Request, @Body() b: CreateMasterUserDto) {
      try {
         const masterUser = await this.userService.createMasterUser(b);
         return res.status(201).send({
            login: masterUser.login,
            role: masterUser.role
         });
      } catch (e) {
         console.log(e);

         throw e;
      }
   }
   @Get("/logout")
   @Role([AppRoles.worker])
   async logout(@Res() res: Response, @Req() req: extendedRequest) {
      try {
         const SID = req.cookies[CookieNames.SID];
         await this.sessionService.destroySession(SID);
         this.sessionService.clearSession(res);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
}
