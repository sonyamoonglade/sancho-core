import {
    Body,
    Controller,
    Delete,
    Get,
    ParseBoolPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {ProductService} from "./product.service";
import {CONTROLLER_PATH_PREFIX} from "../types/constants";
import {Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthorizationGuard} from "../authentication/authorization/authorization.guard";
import {Role} from "../decorators/role/Role";
import {IMAGE_UPLOAD_FILENAME} from "../../types/types";
import {AppRoles} from "../../../common/types";


@Controller(`${CONTROLLER_PATH_PREFIX}/product`)
export class ProductController {

  constructor(private productService:ProductService) {
  }

  @Post('/createProduct')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.master])
  createProduct(@Body() createProductDto: CreateProductDto,
                @Res() res: Response){
    return this.productService.createProduct(res,createProductDto)
  }

  @Post('/uploadProductImage')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.master])
  attachImageToProduct( @Res() res: Response, @Body() body){
    return this.productService.attachImageToProduct(res,Number(body.product_id))
  }
  @Post('/changeProductImage')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.master])
  @UseInterceptors(FileInterceptor(IMAGE_UPLOAD_FILENAME))
  changeProductImage(@Res() res: Response, @UploadedFile() productImageFile,@Body() body){
    return this.productService.changeProductImage(res,productImageFile,Number(body.product_id))
  }

  @Get('/listOfProducts')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.worker])
  getListOfProducts(@Res() res:Response,@Query('has_image',ParseBoolPipe) hasImage: boolean){
    return this.productService.getListOfProducts(res,hasImage);
  }

  @Get('/catalogProducts')
  getCatalogProducts(@Res() res:Response){

    return this.productService.getCatalogProducts(res)
  }

  @Put('/updateProduct')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.master])
  updateProduct(@Res() res: Response, @Query('id', ParseIntPipe) id: number, @Body() updatedProduct){
    return this.productService.updateProduct(res,updatedProduct,id)
  }

  @Delete('/deleteProduct')
  @UseGuards(AuthorizationGuard)
  @Role([AppRoles.master])
  deleteProduct(@Res() res:Response,@Query('id', ParseIntPipe) id: number){
    return this.productService.deleteProduct(res,id)
  }

}
