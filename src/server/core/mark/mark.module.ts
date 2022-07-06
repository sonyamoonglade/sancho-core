import { Module } from "@nestjs/common";
import { MarkRepository } from "./mark.repository";
import { DbModule } from "../../shared/database/db.module";
import { QueryBuilderModule } from "../../shared/queryBuilder/qb.module";

@Module({
   controllers: [],
   providers: [MarkRepository],
   exports: [MarkRepository],
   imports: [DbModule, QueryBuilderModule]
})
export class MarkModule {}
