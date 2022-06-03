import {Module} from "@nestjs/common";
import {SessionService} from "./session.service";
import {SessionMiddleware} from "./middleware/session.middleware";
import {QueryBuilderModule} from "../query_builder/qb.module";
import {DbModule} from "../database/db.module";
import {SessionRepository} from "./session.repository";
import {UserService} from "../user/user.service";
import {RegisterSpamGuard} from "./register-spam.guard";


Module({
  providers:[SessionService,SessionMiddleware,SessionRepository, UserService],
  imports: [DbModule, QueryBuilderModule],
  exports:[SessionRepository,SessionService,SessionMiddleware,RegisterSpamGuard],

})

export class AuthenticationModule {}