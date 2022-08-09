import { ArgumentMetadata, CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware, PipeTransform } from "@nestjs/common";

import { InvalidDateFormat } from "../exceptions/transform.exceptions";
import { helpers } from "../helpers/helpers";

@Injectable()
export class DateTransformPipe implements PipeTransform {
   transform(value: any, metadata: ArgumentMetadata): Date {
      //Not set (100% valid, see interceptor)
      if (value === undefined) {
         return null;
      }
      const v = Date.parse(value as string);

      if (isNaN(v)) {
         throw new InvalidDateFormat();
      }
      return helpers.newUTCFrom(new Date(v));
   }
}
