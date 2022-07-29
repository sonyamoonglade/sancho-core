import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Response } from "express";
import { CreateProductDto } from "./dto/create-product.dto";
import { AppRoles } from "../../../common/types";
import { Role } from "../../packages/decorators/role/Role";
import { FileInterceptor } from "@nestjs/platform-express";
import { extendedRequest } from "../../types/types";
import { PutImageDto } from "./dto/put-image.dto";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { ImageStorageService } from "../../packages/image_storage/image_storage.service";

@Controller("/product")
@UseGuards(AuthorizationGuard)
export class ProductController {
   constructor(private productService: ProductService, private imageStorage: ImageStorageService) {}

   @Get("/all")
   @Role([AppRoles.master])
   async getAll(@Res() res: Response) {
      try {
         const all = await this.productService.getAll();
         return res.status(200).send({
            products: all
         });
      } catch (e) {
         throw e;
      }
   }

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

   @Put("/updateProduct")
   @Role([AppRoles.master])
   async updateProduct(@Res() res: Response, @Query("id", ParseIntPipe) id: number, @Body() updatedProduct) {
      try {
         const updId = await this.productService.updateProduct(updatedProduct, id);
         return res.status(200).send({ id: updId });
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

   @Post("/putImage")
   @UseInterceptors(FileInterceptor("payload"))
   @Role([AppRoles.master])
   async putImage(
      @Res() res: Response,
      @Req() req: extendedRequest,
      @UploadedFile() f: Express.Multer.File,
      @Query("productId", ParseIntPipe) productId: number
   ) {
      try {
         const dto: PutImageDto = new PutImageDto();

         const ok = await this.imageStorage.putImage(dto, f, productId);
         if (!ok) {
            return res.status(400).end();
         }
         await this.productService.updateProduct({ has_image: true, approved: false }, productId);
         return res.status(201).send({
            file: dto.productId + ".png"
         });
      } catch (e) {
         throw e;
      }
   }

   @Get("/")
   @Role([AppRoles.worker])
   async query(@Query("v") q: string, @Res() res: Response) {
      try {
         q = decodeURI(q);
         const resultQuery = await this.productService.query(q);
         return res.status(200).send({ result: resultQuery });
      } catch (e) {
         throw e;
      }
   }

   @Get("/catalog")
   @Role([AppRoles.user])
   async getCatalog(@Res() res: Response) {
      try {
         const catalog = await this.productService.getCatalog();
         const categories = this.productService.getCategories();
         return res.status(200).send({
            catalog,
            categories
         });
      } catch (e) {
         throw e;
      }
   }

   @Put("/approve")
   @Role([AppRoles.master])
   async approveProduct(@Res() res: Response, @Query("v", ParseIntPipe) productId: number) {
      try {
         await this.productService.approveProduct(productId);
         return res.status(200).end();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
}
