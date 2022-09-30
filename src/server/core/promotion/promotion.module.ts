import { Module } from "@nestjs/common";
import { PromotionController } from "./promotion.controller";
import { PromotionService } from "./promotion.service";
import { PromotionRepository } from "./promotion.repository";
import { DbModule } from "../../packages/database/db.module";

@Module({
   controllers: [PromotionController],
   providers: [PromotionService, PromotionRepository],
   exports: [PromotionService, PromotionRepository],
   imports: [DbModule]
})
export class PromotionModule {}
