import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Response } from "express";
import { CreateProductDto } from "./dto/create-product.dto";
import { AppRoles } from "../../../common/types";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { Role } from "../../shared/decorators/role/Role";

@Controller("/product")
@UseGuards(AuthorizationGuard)
export class ProductController {
   constructor(private productService: ProductService) {}

   @Post("/createProduct")
   @Role([AppRoles.master])
   async createProduct(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
      try {
         const productId = await this.productService.createProduct(createProductDto);
         return res.status(201).send({ id: productId });
      } catch (e) {
         throw e;
      }
   }

   @Get("/")
   @Role([AppRoles.worker])
   async query(@Query("query") q: string, @Res() res: Response) {
      try {
         q = decodeURI(q);
         const resultQuery = await this.productService.query(q);
         return res.status(200).send({ result: resultQuery });
      } catch (e) {
         throw e;
      }
   }

   @Get("/catalog")
   async getCatalogP(@Res() res: Response) {
      try {
         const catalog = await this.productService.getCatalogProducts();
         return res.status(200).send(catalog);
      } catch (e) {
         throw e;
      }
   }

   @Put("/updateProduct")
   @Role([AppRoles.master])
   async updateProduct(@Res() res: Response, @Query("id", ParseIntPipe) id: number, @Body() updatedProduct) {
      try {
         await this.productService.updateProduct(updatedProduct, id);
         return res.status(200).end();
      } catch (e) {
         throw e;
      }
   }

   @Delete("/deleteProduct")
   @Role([AppRoles.master])
   async deleteProduct(@Res() res: Response, @Query("id", ParseIntPipe) id: number) {
      try {
         const productId = await this.productService.deleteProduct(id);
         res.status(200).send({
            id: productId
         });
      } catch (e) {
         throw e;
      }
   }
}
