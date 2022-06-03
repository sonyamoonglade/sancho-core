import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {DbModule} from "../database/db.module";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {SessionRepository} from "../authentication/session.repository";
import {SessionService} from "../authentication/session.service";
import {ValidationModule} from "../validation/validation.module";
import {RegisterSpamGuard} from "../authentication/register-spam.guard";


@Module({

  providers: [UserService, UserRepository,SessionService,SessionRepository,RegisterSpamGuard],
  controllers: [UserController],
  imports:[DbModule, QueryBuilderModule,ValidationModule],
  exports:[UserService]

})

export class UserModule {}