import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { MarkService } from "./mark.service";
import { extendedRequest } from "../../types/types";
import { Response } from "express";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { Role } from "../../shared/decorators/role/Role";
import { AppRoles } from "../../../common/types";

@Controller("/mark")
@UseGuards(AuthorizationGuard)
export class MarkController {
   constructor(private markService: MarkService) {}

   @Post("/create")
   @Role([AppRoles.worker])
   async createMark(
      @Req() req: extendedRequest,
      @Res() res: Response,
      @Query("important", ParseBoolPipe) important: boolean,
      @Body() dto: CreateMarkDto
   ) {
      try {
         dto.isImportant = important;
         await this.markService.create(dto);
         return res.status(201).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }

   @Delete("/delete")
   @Role([AppRoles.worker])
   async deleteMark(
      @Req() req: extendedRequest,
      @Res() res: Response,
      @Query("userId", ParseIntPipe) userId: number,
      @Query("markId", ParseIntPipe) markId: number
   ) {
      try {
         await this.markService.delete(userId, markId);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }

   @Get("/")
   @Role([AppRoles.worker])
   async userMarks(@Req() req: extendedRequest, @Res() res: Response, @Query("userId", ParseIntPipe) userId: number) {
      try {
         const marks = await this.markService.userMarks(userId);
         return res.status(200).send({
            marks
         });
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
}
