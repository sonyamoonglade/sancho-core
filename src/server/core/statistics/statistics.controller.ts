import { Controller, Get, Query, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { PinoLogger } from "nestjs-pino";
import { AuthorizationGuard } from "../authorization/authorization.guard";
import { OrderService } from "../order/order.service";
import { Response } from "express";
import { Role } from "../../packages/decorators/role/Role";
import { AggregationPreset, AppRoles, ProductTop } from "../../../common/types";
import { DateTransformPipe } from "../../packages/pipes/date-transform.pipe";
import { AggregationValidationPipe } from "../../packages/pipes/aggregation-validation.pipe";
import { QueryValidationInterceptor } from "./interceptor/query-validation.interceptor";
import { helpers } from "../../packages/helpers/helpers";

@Controller("/admin/statistics")
@UseGuards(AuthorizationGuard)
export class StatisticsController {
   constructor(private statisticsService: StatisticsService, private logger: PinoLogger, private orderService: OrderService) {
      this.logger.setContext(StatisticsController.name);
   }

   @Get("/product/top")
   @Role([AppRoles.master])
   @UseInterceptors(QueryValidationInterceptor)
   async getProductTop(
      @Res() res: Response,
      @Query("from", DateTransformPipe) from: Date,
      @Query("to", DateTransformPipe) to: Date,
      @Query("aggregation", AggregationValidationPipe) aggregation?: string
   ) {
      try {
         const carts = await this.orderService.getOrderCartsInTerms(from, to, aggregation as AggregationPreset);
         const statisticsCarts = this.statisticsService.mapCartsForStatistics(carts);
         const top: ProductTop = await this.statisticsService.generateProductTop(statisticsCarts);
         const mapLikeObj = helpers.mapToObject(top);
         return res.json({
            top: mapLikeObj
         });
      } catch (e) {
         this.logger.error(e);
         throw e;
      }
   }
}
