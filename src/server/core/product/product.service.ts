import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "../entities/Product";
import { Categories, Features } from "../../../common/types";
import {
   InvalidCategoryException,
   ProductAlreadyExistsException,
   ProductCantBeApproved,
   ProductDoesNotExistException
} from "../../shared/exceptions/product.exceptions";
import { ValidationErrorException } from "../../shared/exceptions/validation.exceptions";
import { ProductRepository } from "./product.repository";
import { PutImageDto } from "./dto/put-image.dto";
import { FileStorage } from "../../shared/fileStorage/file.storage";

export interface ProductRepositoryInterface {
   searchQuery(words: string[]): Promise<Product[]>;
   create(dto: CreateProductDto): Promise<number>;
   delete(id: number): Promise<number>;
   update(id: number, updated: Partial<Product>): Promise<number>;
   getById(id: number): Promise<Product>;
   getAll(): Promise<Product[]>;
   getCatalog(): Promise<Product[]>;
   getProductsByIds(productIds: number[]): Promise<Product[]>;
   approveProduct(productId: number): Promise<boolean>;
}

export interface FileStorageInterface {
   putImage(dto: PutImageDto, f: Express.Multer.File, productId: number): Promise<boolean>;
   deleteImage(id: number): Promise<boolean>;
}

@Injectable()
export class ProductService {
   constructor(private productRepository: ProductRepository) {}

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
      const productId = await this.productRepository.create(createProductDto);
      // conflict occurred
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
   async getCatalog(): Promise<Product[]> {
      let products = await this.productRepository.getCatalog();
      products = products.map((product) => this.parseJSONProductFeatures(product));
      const sorted = this.sortByCategory(products);
      return sorted;
   }
   async approveProduct(productId: number): Promise<void> {
      const ok = await this.productRepository.approveProduct(productId);
      if (!ok) {
         throw new ProductCantBeApproved(productId);
      }
      return;
   }

   getCategories(): string[] {
      return Object.values(Categories);
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
