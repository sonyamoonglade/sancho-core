import { DatabaseCartProduct, DeliveryDetails } from "../../../../common/types";
import { IsBoolean, IsDefined, IsString } from "class-validator";

export class VerifyOrderDto {
   @IsDefined()
   @IsString()
   username: string;

   @IsDefined()
   @IsString()
   phoneNumber: string;

   @IsDefined()
   @IsBoolean()
   isDeliveredAsap: boolean;

   deliveredAt?: Date;
   deliveryDetails?: DeliveryDetails;
   isDelivered?: boolean;
   cart?: DatabaseCartProduct[];
   userId: number;
}
