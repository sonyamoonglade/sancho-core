import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AggregationPreset } from "../../../common/types";
import { InvalidAggregationPreset } from "../exceptions/transform.exceptions";

@Injectable()
export class AggregationValidationPipe implements PipeTransform {
   transform(value: any, metadata: ArgumentMetadata): any {
      //Preset is optional
      if (!value) {
         return "";
      }
      const vv = Object.values(AggregationPreset);
      if (!vv.includes(value)) {
         throw new InvalidAggregationPreset(value);
      }
      return value;
   }
}
