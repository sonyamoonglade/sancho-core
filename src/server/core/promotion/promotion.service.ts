import { Inject, Injectable } from "@nestjs/common";
import { PromotionRepository } from "./promotion.repository";
import { PinoLogger } from "nestjs-pino";
import { Promotion } from "../entities/Promotion";
import { UpdatePromotionDto } from "./dto/promotion.dto";

@Injectable()
export class PromotionService {
   constructor(private promotionRepository: PromotionRepository, private logger: PinoLogger) {
      this.logger.setContext(PromotionService.name);
   }

   async initPromotions(): Promise<void> {
      return this.promotionRepository.initPromotions();
   }

   async getAll(): Promise<Promotion[]> {
      return this.promotionRepository.getAll();
   }

   async update(p: UpdatePromotionDto, id: number): Promise<void> {
      return this.promotionRepository.update(p, id);
   }
}
