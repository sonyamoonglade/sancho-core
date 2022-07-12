import { DatabaseCartProduct, DeliveryDetails } from "../../../../common/types";
import { IsBoolean, IsDefined, IsString, MaxLength } from "class-validator";

export class VerifyOrderDto {
   @IsDefined()
   @IsString()
   @MaxLength(30)
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
