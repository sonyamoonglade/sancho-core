import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { CreateMasterUserDto } from "./dto/create-master-user.dto";
import { PreventAuthedGuard } from "./guard/prevent-authed.guard";
import { LoginMasterUserDto } from "./dto/login-master-user.dto";
import { SessionService } from "../session/session.service";
import { AppRoles } from "../../../common/types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { CookieNames, extendedRequest } from "../../types/types";
import { Role } from "../../packages/decorators/role/Role";
import { RegisterSpamGuard } from "../session/guard/register-spam.guard";
import { CreateMarkDto } from "../mark/dto/create-mark.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { CustomerData } from "../entities/User";
import { CookieService } from "../../packages/cookie/cookie.service";

@Controller("/users")
export class UserController {
   constructor(private userService: UserService, private sessionService: SessionService, private cookieService: CookieService) {}

   @Post("/loginMaster")
   @UseGuards(RegisterSpamGuard)
   async loginMaster(@Res() res: Response, @Body() b: LoginMasterUserDto) {
      try {
         const { id, role } = await this.userService.loginMaster(b);
         const SID = await this.sessionService.generateMasterSession(id);
         res = this.cookieService.setMasterSessCookie(res, SID);
         return res.status(200).send({ role });
      } catch (e) {
         throw e;
      }
   }

   @Get("/auth/me")
   async authMe(@Res() res: Response, @Req() req: extendedRequest) {
      try {
         const userId = req.user_id;
         const user = await this.userService.authMe(userId);
         const data = CustomerData(user);
         if (user.role === AppRoles.user) {
            return res.status(200).json(data);
         }
         return res.status(200).send({ role: user.role });
      } catch (e) {
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
         throw e;
      }
   }

   @Get("/credentials")
   async getUserCredentials(@Res() res: Response, @Query("phoneNumber") phoneNumber: string) {
      try {
         const credentials = await this.userService.getUserCredentials(phoneNumber);
         return res.status(200).send({ credentials });
      } catch (e) {
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
            res = this.cookieService.setUserSessCookie(res, SID);
            return res.status(201).end();
         }
         let SID = await this.sessionService.getSIDByUserId(oldUser.id);
         if (SID === undefined) {
            SID = await this.sessionService.generateSession(oldUser.id);
         }
         res = this.cookieService.setUserSessCookie(res, SID);
         return res.status(200).end();
      } catch (e) {
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
         throw e;
      }
   }

   @Post("/mark")
   @Role([AppRoles.worker])
   async createMark(@Req() req: extendedRequest, @Res() res: Response, @Body() dto: CreateMarkDto) {
      try {
         const userId = await this.userService.getUserId(dto.phoneNumber);
         dto.userId = userId;
         await this.userService.createMark(dto);
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }
   @Delete("/mark")
   @Role([AppRoles.worker])
   async deleteMark(@Req() req: extendedRequest, @Res() res: Response, @Query("v", ParseIntPipe) markId: number) {
      try {
         const ok = await this.userService.isRegularMark(markId);
         if (!ok) {
            await this.userService.deleteMark(markId);
         }
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }

   @Get("/find")
   async findByNumber(@Res() res: Response, @Query("v") query: string) {
      try {
         const result = await this.userService.findByNumberQuery(query);
         return res.status(200).send({ result });
      } catch (e) {
         throw e;
      }
   }
}
