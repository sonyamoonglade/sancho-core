import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { UserService } from "../user/user.service";
import { SessionService } from "../authentication/session.service";
import { UserRepository } from "../user/user.repository";
import { SessionRepository } from "../authentication/session.repository";
import { QueryBuilderModule } from "../../shared/queryBuilder/qb.module";
import { DbModule } from "../../shared/database/db.module";
import { FileStorageModule } from "../../shared/fileStorage/file-storage.module";
import { FileStorage } from "../../shared/fileStorage/file.storage";

@Module({
   providers: [ProductService, ProductRepository, SessionService, UserRepository, SessionRepository, UserService, FileStorage],
   controllers: [ProductController],
   exports: [ProductService, ProductRepository],
   imports: [DbModule, QueryBuilderModule, FileStorageModule]
})
export class ProductModule {}
