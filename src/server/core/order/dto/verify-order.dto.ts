import { DatabaseCartProduct, DeliveryDetails, OrderStatus } from "../../../../common/types";
import { IsBoolean, IsDefined, IsString, MaxLength } from "class-validator";

export class VerifyOrderInput {
   @IsDefined()
   @IsString()
   @MaxLength(30)
   username: string;

   @IsDefined()
   @IsString()
   phone_number: string;

   @IsDefined()
   @IsBoolean()
   is_delivered_asap: boolean;

   delivery_details?: DeliveryDetails;
   is_delivered?: boolean;
   cart?: DatabaseCartProduct[];
}

export class VerifyOrderDto {
   id: number;
   is_delivered_asap: boolean;
   delivery_details?: DeliveryDetails;
   is_delivered?: boolean;
   cart?: DatabaseCartProduct[];
   verified_at: Date;
   status: OrderStatus;
   total_cart_price: number;
}
