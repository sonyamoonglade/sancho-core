import { Module } from "@nestjs/common";
import { MiscController } from "./misc.controller";
import { DbModule } from "../../shared/database/db.module";
import { MiscRepository } from "./misc.repository";
import { MiscService } from "./misc.service";
import { AuthorizationModule } from "../authorization/authorization.module";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../authentication/session.module";
import { QueryBuilderModule } from "../../shared/queryBuilder/qb.module";
import { UserService } from "../user/user.service";
import { SessionService } from "../authentication/session.service";

@Module({
   controllers: [MiscController],
   providers: [MiscService, MiscRepository],
   imports: [DbModule, AuthorizationModule, UserModule, SessionModule, QueryBuilderModule],
   exports: [MiscRepository, MiscService]
})
export class MiscModule {}
