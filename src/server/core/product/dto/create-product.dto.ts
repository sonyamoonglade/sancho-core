import {Product} from "../../entities/Product";
import {Features} from "../../../../common/types";


export class CreateProductDto implements Partial<Product> {

  name: string
  category: string
  price: number
  translate: string
  features: Features
  description?: string


}