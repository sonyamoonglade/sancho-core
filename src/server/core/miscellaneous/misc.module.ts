import { Module } from "@nestjs/common";
import { MiscController } from "./misc.controller";
import { DbModule } from "../../packages/database/db.module";
import { MiscRepository } from "./misc.repository";
import { MiscService } from "./misc.service";
import { AuthorizationModule } from "../authorization/authorization.module";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../authentication/session.module";
import { QueryBuilderModule } from "../../packages/query_builder/qb.module";

@Module({
   controllers: [MiscController],
   providers: [MiscService, MiscRepository],
   imports: [DbModule, AuthorizationModule, UserModule, SessionModule, QueryBuilderModule],
   exports: [MiscRepository, MiscService]
})
export class MiscModule {}
