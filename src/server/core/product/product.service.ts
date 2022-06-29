import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Response } from "express";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "../entities/Product";
import { Categories, Features } from "../../../common/types";
import { InvalidCategoryException, ProductAlreadyExistsException, ProductDoesNotExistException } from "../../shared/exceptions/product.exceptions";
import { ValidationErrorException } from "../../shared/exceptions/validation.exceptions";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";

@Injectable()
export class ProductService {
   constructor(private productRepository: ProductRepository) {}

   getCategories(): string[] {
      const categories = [];
      for (const v of Object.values(Categories)) {
         categories.push(v);
      }
      return categories;
   }

   async query(q: string): Promise<Product[]> {
      if (q.trim().length === 0) {
         throw new ValidationErrorException();
      }
      const words = q.split(" ").filter((w) => w.trim().length !== 0);
      return this.productRepository.searchQuery(words);
   }

   async createProduct(createProductDto: CreateProductDto): Promise<number> {
      const { name, category } = createProductDto;

      const cs = this.getCategories();
      if (!cs.includes(category)) {
         throw new InvalidCategoryException(category);
      }

      createProductDto.features = JSON.stringify(createProductDto.features) as unknown as Features;
      const productId = await this.productRepository.createProduct(createProductDto);
      // conflict occurred
      if (productId === 0) {
         throw new ProductAlreadyExistsException(name);
      }
      return productId;
   }
   async updateProduct(updated: Partial<Product>, id: number): Promise<void> {
      if (!(await this.doesProductExist(id))) {
         throw new ProductDoesNotExistException(id);
      }
      await this.productRepository.update(id, updated);
      return;
   }
   async deleteProduct(id: number): Promise<number> {
      const productId = await this.productRepository.deleteProduct(id);
      if (productId === 0) {
         throw new ProductDoesNotExistException(id);
      }
      return productId;
   }
   async getListOfProducts(res: Response, has_image) {
      try {
         let products: Product[] = await this.productRepository.get({
            where: { has_image }
         });
         products = products.map((product) => this.parseJSONProductFeatures(product));
         return res.status(200).send({ products });
      } catch (e) {
         throw new UnexpectedServerError();
      }
   }
   async getCatalog(): Promise<Product[]> {
      let products: Product[] = await this.productRepository.get({
         where: { has_image: true }
      });
      products = products.map((product) => this.parseJSONProductFeatures(product));
      const sorted = this.sortByCategory(products);
      return sorted;
   }
   async doesProductExist(id: number): Promise<boolean> {
      const result = await this.productRepository.get({ where: { id } });
      return result.length > 0;
   }
   parseJSONProductFeatures(product: Product): Product {
      return { ...product, features: JSON.parse(product.features as string) };
   }
   sortByCategory(unsorted: Product[]): Product[] {
      const pizza = unsorted.filter((p) => p.category === Categories.PIZZA);
      const drinks = unsorted.filter((p) => p.category === Categories.DRINKS);
      return [...pizza, ...drinks];
   }
}
