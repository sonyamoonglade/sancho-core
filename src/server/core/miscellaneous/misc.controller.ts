import { Body, Controller, Get, Post, Put, Res, UseGuards } from "@nestjs/common";

import { MiscService } from "./misc.service";
import { Response } from "express";
import { Role } from "../../shared/decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { InitMiscDto } from "./dto/init-misc.dto";
import { UpdateMiscDto } from "./dto/update-misc.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";

@Controller("/misc")
export class MiscController {
   constructor(private miscService: MiscService) {}

   @Get()
   async getAllMiscellaneous(@Res() res: Response) {
      try {
         const misc = await this.miscService.getAllValues();
         const response = {
            DELIVERY_PUNISHMENT_THRESHOLD: misc.delivery_punishment_threshold,
            DELIVERY_PUNISHMENT_VALUE: misc.delivery_punishment_value
         };
         return res.status(200).send({ result: response });
      } catch (e) {
         throw e;
      }
   }

   @Post("/init")
   @UseGuards(AuthorizationGuard)
   @Role([AppRoles.master])
   async initMiscellaneous(@Res() res: Response, @Body() b: InitMiscDto) {
      try {
         await this.miscService.init(b);
         return res.status(201).end();
      } catch (e) {
         throw e;
      }
   }

   @Put("/update")
   @UseGuards(AuthorizationGuard)
   @Role([AppRoles.master])
   async updateMiscellaneous(@Res() res: Response, @Body() b: UpdateMiscDto) {
      try {
         await this.miscService.update(b);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }
}
