import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { UserRepository } from "../user/user.repository";
import { SessionRepository } from "../session/session.repository";
import { QueryBuilderModule } from "../../packages/query_builder/qb.module";
import { DbModule } from "../../packages/database/db.module";
import { ImageStorageService } from "../../packages/imageStorage/image_storage.service";
import { ImageStorageModule } from "../../packages/imageStorage/image_storage.module";

@Module({
   providers: [ProductRepository, ProductService, SessionService, UserRepository, SessionRepository, UserService, ImageStorageService],
   controllers: [ProductController],
   exports: [ProductService, ProductRepository],
   imports: [DbModule, QueryBuilderModule, ImageStorageModule]
})
export class ProductModule {}
