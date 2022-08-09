import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";
import { OrderModule } from "../order/order.module";
import { QueryBuilderModule } from "../../packages/query_builder/qb.module";
import { DbModule } from "../../packages/database/db.module";
import { SessionModule } from "../session/session.module";
import { MiddlewareConfigProxy } from "@nestjs/common/interfaces";

@Module({
   controllers: [StatisticsController],
   providers: [StatisticsService],
   exports: [StatisticsService],
   imports: [DbModule, QueryBuilderModule, OrderModule, SessionModule]
})
export class StatisticsModule {}
