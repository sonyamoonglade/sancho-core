import { Body, Controller, Get, Param, ParseIntPipe, Put, Res, UseGuards } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { Response } from "express";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { UpdatePromotionDto } from "./dto/promotion.dto";
import { Role } from "../../packages/decorators/role/Role";
import { AppRoles } from "../../../common/types";

@Controller("promotion")
export class PromotionController {
   constructor(private promotionService: PromotionService) {}

   @Get("/")
   async getAll(@Res() res: Response) {
      try {
         const promotions = await this.promotionService.getAll();
         return res.status(200).json({
            promotions
         });
      } catch (e) {
         throw e;
      }
   }

   @Put("/admin/update/:promotionId")
   @UseGuards(AuthorizationGuard)
   @Role([AppRoles.master])
   async update(@Res() res: Response, @Param("promotionId", ParseIntPipe) promotionId: number, @Body() inp: UpdatePromotionDto) {
      try {
         await this.promotionService.update(inp, promotionId);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }
}
