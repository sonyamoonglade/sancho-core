import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { FrontendProduct, Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { CreateCategoryDto } from "./dto/category.dto";
import { CategoryAlreadyExists } from "../../packages/exceptions/product.exceptions";

@Injectable()
export class CategoryService {
   constructor(private categoryRepository: CategoryRepository) {}

   public async create(dto: CreateCategoryDto): Promise<void> {
      try {
         await this.categoryRepository.create(dto);
      } catch (e) {
         const msg = e?.message;
         if (msg?.includes("duplicate")) {
            throw new CategoryAlreadyExists(dto.name);
         }
         throw e;
      }
   }
   public async delete(): Promise<void> {}
   public async getAll(): Promise<Category[]> {
      return this.categoryRepository.getAll();
   }
   public async getCategNamesSorted(): Promise<string[]> {
      return this.categoryRepository.getCategNamesSorted();
   }
   public async rankUp(name: string): Promise<void> {
      return this.categoryRepository.rankUp(name);
   }
   public async rankDown(name: string): Promise<void> {
      return this.categoryRepository.rankDown(name);
   }
}
