import {Injectable} from "@nestjs/common";
import {ProductRepository} from "./product.repository";
import {Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {Categories} from "../../../common/types";
import {
  InvalidCategoryException,
  ProductAlreadyExistsException,
  ProductDoesNotExistException
} from "../../shared/exceptions/product.exceptions";
import {ValidationErrorException} from "../../shared/exceptions/validation.exceptions";
import {UnexpectedServerError} from "../../shared/exceptions/unexpected-errors.exceptions";

@Injectable()
export class ProductService {

  constructor(private productRepository:ProductRepository) {
  }

  getCategories(): string[]{
    const categories = []
    for(const v of Object.values(Categories)){
      categories.push(v)
    }
    return categories
  }

  async query(q: string): Promise<Product[]>{
    if(q.trim().length === 0){ throw new ValidationErrorException() }
    let sql: string;
    const words = q.split(" ").filter(w => w.trim().length !== 0)
    if(words.length > 1){
      const joinedWords = words.join(' & ')
      sql = `
        select * from products where to_tsvector('russian',translate) @@ to_tsquery('russian','${joinedWords}:*') order by price desc
       `
    }else {
      sql = `
        select * from products where to_tsvector('russian',translate) @@ to_tsquery('russian','${q.trim()}:*') order by price desc
      `
    }

    const result:Product[] = await this.productRepository.customQuery(sql)
    return result
  }

  async createProduct(createProductDto:CreateProductDto):Promise<Product>{

    const {name,category} = createProductDto
    if(await this.doesProductAlreadyExist(name)){ throw new ProductAlreadyExistsException(name) }

    const cs = this.getCategories()
    if(!cs.includes(category)){ throw new InvalidCategoryException(category) }

    try {
      const product:Product = {...createProductDto}
      product.features = JSON.stringify(product.features)

      const savedProduct = await this.productRepository.save(product)
      const parsedProduct = this.parseJSONProductFeatures(savedProduct)
      return parsedProduct
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async attachImageToProduct(res:Response, product_id: number){
    if(!await this.doesProductEvenExists(product_id)) { throw new ProductDoesNotExistException(product_id) }
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

  async getCatalogProducts():Promise<Product[]>{
    let products: Product[] = await this.productRepository.get({where:{has_image: true}})
    products = products.map(product => this.parseJSONProductFeatures(product))
    const sorted = this.sortByCategory(products)
    return sorted
  }

  async deleteProduct(res:Response, id:number): Promise<void>{
      await this.productRepository.delete(id)
      return
  }
  // TODO: APPLY MIDDLEWARE TO CHECK IF EXIST OR NOT!!
  async updateProduct(res:Response, updated: Partial<Product>, id: number): Promise<void>{
    if(!await this.doesProductEvenExists(id)) { throw new ProductDoesNotExistException(id) }
    await this.productRepository.update(id,updated)
    return
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

  sortByCategory(unsorted: Product[]): Product[]{
    const pizza = unsorted.filter(p => p.category === Categories.PIZZA)
    const drinks = unsorted.filter(p => p.category === Categories.DRINKS)
    return [...pizza,...drinks]
  }

}
