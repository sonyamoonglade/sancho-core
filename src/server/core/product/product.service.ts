import {Injectable} from "@nestjs/common";
import {ProductRepository} from "./product.repository";
import {Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {UnexpectedServerError} from "../exceptions/unexpected-errors.exceptions";
import {ProductAlreadyExistsException, ProductDoesNotExistException} from "../exceptions/product.exceptions";
import {FileTypes} from "../types/types";
import {ValidationService} from "../validation/validation.service";
import {ValidationErrorException} from "../exceptions/validation.exceptions";

@Injectable()
export class ProductService {

  constructor(private productRepository:ProductRepository,
              private validationService:ValidationService
              ) {
  }

  async createProduct(res:Response, createProductDto:CreateProductDto):Promise<Response>{

    const validationResult = this.validationService.validateObjectFromSqlInjection(createProductDto)
    if(!validationResult) throw new ValidationErrorException()

    const {name} = createProductDto
    if(await this.doesProductAlreadyExist(name)) throw new ProductAlreadyExistsException(name)

    try {
      const product:Product = {...createProductDto}
      product.features = JSON.stringify(product.features)

      const savedProduct = await this.productRepository.save(product)
      const parsedProduct = this.parseJSONProductFeatures(savedProduct)
      return res.status(201).send({product:parsedProduct})

    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async attachImageToProduct(res:Response, product_id: number){
    if(!await this.doesProductEvenExists(product_id)) throw new ProductDoesNotExistException(product_id)
    const fileName = `${product_id}.jpg`
    try {
      await this.productRepository.update(product_id,{has_image: true})
      res.status(200).send({result:[fileName]})
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async changeProductImage(res: Response, newFile: any, product_id: number){



  }

  async getListOfProducts(res:Response,has_image){

      try {
        let products: Product[] = await this.productRepository.get({where:{has_image}})
        products = products.map(product => this.parseJSONProductFeatures(product))
        return res.status(200).send({products})
      }catch (e){
        throw new UnexpectedServerError()
      }

  }

  async getCatalogProducts(res:Response){
    try {
      let products: Product[] = await this.productRepository.get({where:{has_image: true}})
      products = products.map(product => this.parseJSONProductFeatures(product))
      return res.status(200).send(products)
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async deleteProduct(res:Response, id:number){
    try {
      await this.productRepository.delete(id)
      res.status(200).end()
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }
  // TODO: APPLY MIDDLEWARE TO CHECK IF EXIST OR NOT!!
  async updateProduct(res:Response, updated: Partial<Product>, id: number){

    const validationResult = this.validationService.validateObjectFromSqlInjection(updated)
    if(!validationResult) throw new ValidationErrorException()

    if(!await this.doesProductEvenExists(id)) throw new ProductDoesNotExistException(id)

    try {
      await this.productRepository.update(id,updated)
      res.status(200).send({updated})
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async doesProductAlreadyExist(name: string): Promise<boolean>{
    const product = await this.productRepository.get({where:{name}})
    return product.length > 0
  }

  async doesProductEvenExists(id: number):Promise<boolean>{

    const result = await this.productRepository.get({where:{id}})

    return result.length > 0

  }

  parseJSONProductFeatures(product: Product):Product{
    return {...product,features:JSON.parse(product.features as string)}
  }

}
