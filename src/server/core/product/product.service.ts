import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { FrontendProduct, Product } from "../entities/Product";
import { Categories, Features } from "../../../common/types";
import {
   InvalidCategoryException,
   ProductAlreadyExistsException,
   ProductCantBeApproved,
   ProductDoesNotExistException,
} from "../../packages/exceptions/product.exceptions";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { ProductRepository } from "./product.repository";

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
      const all = await this.productRepository.getAll();
      return all.map((p) => {
         return { ...p, features: JSON.parse(p.features as string) };
      });
   }
   async getCatalog(): Promise<Product[]> {
      const products = await this.productRepository.getCatalog();
      const mapped = this.mapToFrontendProduct(products);
      return this.sortByCategory(mapped);
   }
   mapToFrontendProduct(toMap: Product[]): FrontendProduct[] {
      return toMap.map((p) => {
         return {
            id: p.id,
            price: p.price,
            description: p.description,
            features: this.parseJSONFeatures(p.features as string), // from db it's a string
            translate: p.translate,
            category: p.category,
            name: p.name,
            image_url: p.image_url
         };
      });
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

   parseJSONFeatures(features: string): Features {
      return JSON.parse(features);
   }

   sortByCategory(unsorted: Product[]): Product[] {
      //todo: filter by rank
      const pizza = unsorted.filter((p) => p.category === Categories.PIZZA);
      const drinks = unsorted.filter((p) => p.category === Categories.DRINKS);
      const desserts = unsorted.filter((p) => p.category === Categories.DESSERT);
      const sushi = unsorted.filter((p) => p.category === Categories.SUSHI);
      return [...pizza, ...drinks, ...desserts, ...sushi];
   }
}
