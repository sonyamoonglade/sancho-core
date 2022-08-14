import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { FrontendProduct, Product } from "../entities/Product";
import { Categories, Features } from "../../../common/types";
import {
   InvalidCategoryException,
   ProductAlreadyExistsException,
   ProductCantBeApproved,
   ProductDoesNotExistException
} from "../../packages/exceptions/product.exceptions";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { ProductRepository } from "./product.repository";
import { CategoryService } from "../category/category.service";

export interface ProductRepositoryInterface {
   searchQuery(words: string[]): Promise<Product[]>;
   create(dto: CreateProductDto): Promise<number>;
   delete(id: number): Promise<number>;
   update(id: number, updated: Partial<Product>): Promise<number>;
   getById(id: number): Promise<Product>;
   getAll(): Promise<Product[]>;
   getCatalog(): Promise<FrontendProduct[]>;
   getProductsByIds(productIds: number[]): Promise<Product[]>;
   approveProduct(productId: number): Promise<boolean>;
}

@Injectable()
export class ProductService {
   constructor(private productRepository: ProductRepository, private categoryService: CategoryService) {}

   async query(q: string): Promise<Product[]> {
      if (q.trim().length === 0) {
         throw new ValidationErrorException();
      }
      const words = q.split(" ").filter((w) => w.trim().length !== 0);
      return this.productRepository.searchQuery(words);
   }
   async createProduct(createProductDto: CreateProductDto): Promise<number> {
      const { name, category } = createProductDto;

      const categs = await this.categoryService.getAll();
      //Check whether some category exists with such name
      const ok = categs.some((categ) => categ.name === name);
      if (!ok) {
         throw new InvalidCategoryException(category);
      }

      createProductDto.features = JSON.stringify(createProductDto.features) as unknown as Features;
      const productId = await this.productRepository.create(createProductDto);
      // Insert conflict occurred
      if (productId === 0) {
         throw new ProductAlreadyExistsException(name);
      }
      return productId;
   }
   async updateProduct(updated: Partial<Product>, id: number): Promise<void> {
      const updatedId = await this.productRepository.update(id, updated);
      if (updatedId === 0) {
         throw new ProductDoesNotExistException(id);
      }
      return;
   }
   async deleteProduct(id: number): Promise<number> {
      const productId = await this.productRepository.delete(id);
      if (productId === 0) {
         throw new ProductDoesNotExistException(id);
      }
      return productId;
   }
   async getAll(): Promise<Product[]> {
      return this.productRepository.getAll();
   }
   async getCatalog(): Promise<FrontendProduct[]> {
      return this.productRepository.getCatalog();
   }

   async approveProduct(productId: number): Promise<void> {
      const ok = await this.productRepository.approveProduct(productId);
      if (!ok) {
         throw new ProductCantBeApproved(productId);
      }
      return;
   }
}
