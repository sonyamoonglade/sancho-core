import { Body, Controller, Get, Param, ParseIntPipe, Put, Res, UseGuards } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { Response } from "express";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { ModifyPromotionInput } from "./dto/promotion.dto";
import { Role } from "../../packages/decorators/role/Role";
import { AppRoles } from "../../../common/types";

@Controller("promotion")
export class PromotionController {
   constructor(private promotionService: PromotionService) {}

   @Get("/")
   async getAll(@Res() res: Response) {
      try {
      } catch (e) {
         throw e;
      }
   }

   @Put("/admin/modify/:promotionId")
   @UseGuards(AuthorizationGuard)
   @Role([AppRoles.master])
   async modify(
      @Res() res: Response,
      @Param("promotionId", ParseIntPipe) promotionId: number,
      @Body() inp: ModifyPromotionInput
   ) {
      try {
      } catch (e) {
         throw e;
      }
   }
}
