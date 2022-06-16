import {
    Body,
    Controller,
    Delete,
    Get,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import {ProductService} from "./product.service";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {Role} from "../decorators/role/Role";
import {AppRoles} from "../../../common/types";
import {AuthorizationGuard} from "../authorization/authorization.guard";


@Controller(`${CONTROLLER_PATH_PREFIX}/product`)
@UseGuards(AuthorizationGuard)
export class ProductController {

  constructor(private productService:ProductService) {
  }

  @Post('/createProduct')
  @Role([AppRoles.master])
  async createProduct(@Body() createProductDto: CreateProductDto, @Res() res: Response){
    try {
        const createdProduct = await this.productService.createProduct(createProductDto)
        return res.status(201).send({product:createdProduct})
    }catch (e) {
        throw e
    }
  }

  @Get("/")
  @Role([AppRoles.worker])
  async query(@Query("query") q: string, @Res() res:Response){
      try {
          q = decodeURI(q)
          const resultQuery = await this.productService.query(q)
          return res.status(200).send({result: resultQuery})
      }catch (e) {
          throw e
      }
  }


  @Get('/catalogProducts')
  async getCatalogProducts(@Res() res:Response){
    try {
        const catalog = await this.productService.getCatalogProducts()
        return res.status(200).send(catalog)
    }catch (e) {
       throw e
    }
  }

  @Put('/updateProduct')
  @Role([AppRoles.master])
  async updateProduct(@Res() res: Response, @Query('id', ParseIntPipe) id: number, @Body() updatedProduct){
      try {
          await this.productService.updateProduct(res,updatedProduct,id)
          return res.status(200).end()
      }catch (e) {
          throw e
      }
  }

  @Delete('/deleteProduct')
  @Role([AppRoles.master])
  async deleteProduct(@Res() res:Response,@Query('id', ParseIntPipe) id: number){
    try {
        await this.productService.deleteProduct(res,id)
        res.status(200).end()
    }catch (e) {
        throw e
    }
  }

}
