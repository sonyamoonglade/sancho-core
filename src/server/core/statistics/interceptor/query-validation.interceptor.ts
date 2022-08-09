import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ProductTopQueryInput } from "../dto/statistics.dto";
import { InvalidQuery } from "../../../packages/exceptions/statistics.exceptions";

@Injectable()
export class QueryValidationInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler<any>): any {
      const q: ProductTopQueryInput = context.switchToHttp().getRequest().query;
      //Preset is set
      if (q?.aggregation !== undefined) {
         //Date is also set
         if (q.from !== undefined || q.to !== undefined) {
            throw new InvalidQuery();
         }
      }
      //Preset is not set
      else {
         //Date is not set as well
         if (q?.from === undefined || q?.to === undefined) {
            throw new InvalidQuery();
         }
      }
      return next.handle();
   }
}
