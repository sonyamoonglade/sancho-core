import { DatabaseCartProduct, DeliveryDetails } from "../../../../common/types";
import { IsBoolean, IsDefined, IsString } from "class-validator";

export class VerifyOrderDto {
   @IsDefined()
   @IsString()
   verified_fullname: string;

   @IsDefined()
   @IsString()
   phone_number: string;

   @IsDefined()
   @IsBoolean()
   is_delivered_asap: boolean;

   delivered_at?: Date;
   delivery_details?: DeliveryDetails;
   is_delivered?: boolean;
   cart?: DatabaseCartProduct[];
}
