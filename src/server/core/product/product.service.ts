import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { FrontendProduct, Product, products } from "../entities/Product";
import { Cart, Categories, DatabaseCartProduct, Features } from "../../../common/types";
import {
   InvalidCategoryException,
   ProductAlreadyExistsException,
   ProductCantBeApproved,
   ProductDoesNotExistException
} from "../../packages/exceptions/product.exceptions";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { ProductRepository } from "./product.repository";
import { CategoryService } from "../category/category.service";
import { categories } from "../entities/Category";
import { PinoLogger } from "nestjs-pino";
import { compileFunction } from "vm";

export interface ProductRepositoryInterface {
   searchQuery(words: string[]): Promise<FrontendProduct[]>;
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
   constructor(
      private productRepository: ProductRepository,
      private categoryService: CategoryService,
      private logger: PinoLogger
   ) {
      this.logger.setContext(ProductService.name);
   }

   async query(q: string): Promise<FrontendProduct[]> {
      if (q.trim().length === 0) {
         throw new ValidationErrorException();
      }
      const words = q.split(" ").filter((w) => w.trim().length !== 0);
      return this.productRepository.searchQuery(words);
   }
   async createProduct(dto: CreateProductDto): Promise<number> {
      const { name, category, features } = dto;

      const categs = await this.categoryService.getAll();
      //Check whether some category exists with such name
      const categ = categs.find((categ) => categ.name === category);
      if (!categ) {
         throw new InvalidCategoryException(category);
      }

      dto.features = JSON.stringify(features) as unknown as Features;
      dto.category_id = categ.category_id;

      const productId = await this.productRepository.create(dto);
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
   async productCountByCategory(name: string): Promise<number> {
      return this.productRepository.productCountByCategory(name);
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

   public async calculateCartAmount(cart: DatabaseCartProduct[]): Promise<number> {
      const productIds: number[] = cart.map((p) => p.id);
      const products: Product[] = await this.productRepository.getProductsByIds(productIds);
      const amount = products.reduce((a, c) => {
         const same_product_idx = cart.findIndex((p) => p.id == c.id);
         const product_quantity = cart[same_product_idx].quantity;
         a += c.price * product_quantity;
         return a;
      }, 0);

      return amount;
   }

   //filterCart matches cart's products with original product's price, ids, name etc...  and returns appropriate cart
   public async filterCart(cart: Cart): Promise<Cart> {
      const products: Product[] = await this.productRepository.getAll();
      const outputCart: Cart = [];
      for (let i = 0; i < products.length; i++) {
         const p = products[i];
         for (let j = 0; j < cart.length; j++) {
            const cp = cart[j];
            if (cp?.id === p?.id) {
               const origProduct: DatabaseCartProduct = {
                  price: p.price,
                  quantity: cp.quantity,
                  id: cp.id,
                  translate: p.translate,
                  image_url: p.image_url,
                  category: cp.category
               };
               outputCart.push(origProduct);
            }
         }
      }
      return outputCart;
   }
}
