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
   // public async sortByCategRankAndMap(products: Product[]): FrontendProduct[] {
   //    const categs = await this.getAll();
   //    const sorted = products.sort((a, b) => {
   //       let arank: number;
   //       let brank: number;
   //       //Find actual rank
   //       for (const categ of categs) {
   //          if (a.category_id === categ.category_id) {
   //             arank = categ.rank;
   //          }
   //          if (b.category_id === categ.category_id) {
   //             brank = categ.rank;
   //          }
   //       }
   //    });
   // }
}
