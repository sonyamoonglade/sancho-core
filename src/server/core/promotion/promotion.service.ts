import { Inject, Injectable } from "@nestjs/common";
import { PromotionRepository } from "./promotion.repository";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class PromotionService {
   constructor(private promotionRepository: PromotionRepository, private logger: PinoLogger) {
      this.logger.setContext(PromotionService.name);
   }

   async initPromotions(): Promise<void> {
      return this.promotionRepository.initPromotions();
   }
}
