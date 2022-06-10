import {Product} from "../../entities/Product";
import {Categories, Features} from "../../../../common/types";
import {IsDefined, IsNumber, IsString} from "class-validator";


export class CreateProductDto implements Partial<Product> {


  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  category: Categories

  @IsDefined()
  @IsNumber()
  price: number

  @IsDefined()
  @IsString()
  translate: string

  @IsDefined()
  features: Features

  @IsDefined()
  description: string


}