import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductController} from './product.controller';
import {ProductRepository} from "./product.repository";
import {DbModule} from "../database/db.module";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {FileService} from "../file/file.service";
import {ValidationService} from "../validation/validation.service";
import {UserService} from "../user/user.service";
import {SessionService} from "../authentication/session.service";
import {UserRepository} from "../user/user.repository";
import {SessionRepository} from "../authentication/session.repository";

@Module({
  // sessionserv,userrepo,sessionrepo,validserv

  providers: [
    ProductService, ProductRepository,FileService,
    ValidationService,SessionService,UserRepository,
    SessionRepository, ValidationService,UserService],
  controllers: [ProductController],
  exports: [ProductService,ProductRepository],
  imports:[DbModule,QueryBuilderModule]
})
export class ProductModule {}
