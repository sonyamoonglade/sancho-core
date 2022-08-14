import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { DbModule } from "../../packages/database/db.module";

@Module({
   providers: [CategoryService, CategoryRepository],
   exports: [CategoryService],
   imports: [DbModule]
})
export class CategoryModule {}
