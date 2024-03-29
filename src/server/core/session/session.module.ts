import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionMiddleware } from "./middleware/session.middleware";
import { SessionRepository } from "./session.repository";
import { UserService } from "../user/user.service";
import { RegisterSpamGuard } from "./guard/register-spam.guard";
import { QueryBuilderModule } from "../../packages/query_builder/qb.module";
import { DbModule } from "../../packages/database/db.module";

Module({
   providers: [SessionService, SessionMiddleware, SessionRepository, UserService],
   imports: [DbModule, QueryBuilderModule],
   exports: [SessionRepository, SessionService, SessionMiddleware, RegisterSpamGuard]
});

export class SessionModule {}
