import { Module } from "@nestjs/common";
import { MarkService } from "./mark.service";
import { MarkController } from "./mark.controller";
import { MarkRepository } from "./mark.repository";
import { UserModule } from "../user/user.module";
import { DbModule } from "../../shared/database/db.module";
import { QueryBuilderModule } from "../../shared/queryBuilder/qb.module";

@Module({
   controllers: [MarkController],
   providers: [MarkService, MarkRepository],
   exports: [MarkService],
   imports: [UserModule, DbModule, QueryBuilderModule]
})
export class MarkModule {}
