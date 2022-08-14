import { Body, Controller, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Role } from "../../packages/decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { Response } from "express";
import { CreateCategoryDto } from "./dto/category.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { PinoLogger } from "nestjs-pino";

@Controller("/admin/category")
@UseGuards(AuthorizationGuard)
export class CategoryController {
   constructor(private categoryService: CategoryService, private logger: PinoLogger) {}

   @Post("/create")
   @Role([AppRoles.master])
   async createCategory(@Res() res: Response, @Body() inp: CreateCategoryDto) {
      try {
         await this.categoryService.create(inp);
         return res.status(201).end();
      } catch (e) {
         this.logger.error(e);
         throw e;
      }
   }
   @Put("/rankup")
   @Role([AppRoles.master])
   async rankUp(@Res() res: Response, @Query("name") categName: string) {
      try {
         await this.categoryService.rankUp(categName);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }
   @Put("/rankdown")
   @Role([AppRoles.master])
   async rankDown(@Res() res: Response, @Query("name") categName: string) {
      try {
         await this.categoryService.rankDown(categName);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }
}
