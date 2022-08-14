import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Role } from "../../packages/decorators/role/Role";
import { AppRoles } from "../../../common/types";
import { Response } from "express";
import { CreateCategoryDto } from "./dto/category.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { PinoLogger } from "nestjs-pino";
import { ProductService } from "../product/product.service";
import { CategoryIsNotEmpty } from "../../packages/exceptions/product.exceptions";

@Controller("/admin/category")
@UseGuards(AuthorizationGuard)
export class CategoryController {
   constructor(private categoryService: CategoryService, private logger: PinoLogger, private productService: ProductService) {}

   @Get("/")
   @Role([AppRoles.master])
   async adminCategories(@Res() res: Response) {
      try {
         const categories = await this.categoryService.getAll();
         return res.status(200).json({ categories });
      } catch (e) {
         throw e;
      }
   }

   @Post("/")
   @Role([AppRoles.master])
   async createCategory(@Res() res: Response, @Body() inp: CreateCategoryDto) {
      try {
         await this.categoryService.create(inp);
         const updCategs = await this.categoryService.getAll();
         return res.status(201).json({
            categories: updCategs
         });
      } catch (e) {
         this.logger.error(e);
         throw e;
      }
   }

   @Delete("/:name")
   @Role([AppRoles.master])
   async deleteCategory(@Res() res: Response, @Param("name") categName: string) {
      try {
         const count = await this.productService.productCountByCategory(categName);
         if (count > 0) {
            throw new CategoryIsNotEmpty(categName, count);
         }
         await this.categoryService.delete(categName);
         const updCategs = await this.categoryService.getAll();
         return res.status(200).json({
            categories: updCategs
         });
      } catch (e) {
         throw e;
      }
   }
   @Put("/rankup")
   @Role([AppRoles.master])
   async rankUp(@Res() res: Response, @Query("name") categName: string) {
      try {
         await this.categoryService.rankUp(categName);
         const updCategs = await this.categoryService.getAll();
         return res.status(200).json({
            categories: updCategs
         });
      } catch (e) {
         throw e;
      }
   }
   @Put("/rankdown")
   @Role([AppRoles.master])
   async rankDown(@Res() res: Response, @Query("name") categName: string) {
      try {
         await this.categoryService.rankDown(categName);
         const updCategs = await this.categoryService.getAll();
         return res.status(200).json({
            categories: updCategs
         });
      } catch (e) {
         throw e;
      }
   }
}
