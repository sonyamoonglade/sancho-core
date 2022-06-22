import { Order } from "../../entities/Order";
import { DatabaseCartProduct, DeliveryDetails } from "../../../../common/types";
import { IsBoolean, IsDate, IsDefined, IsString } from "class-validator";

export class CreateUserOrderDto implements Partial<Order> {
   @IsDefined()
   cart: DatabaseCartProduct[];

   @IsDefined()
   @IsBoolean()
   is_delivered_asap: boolean;

   @IsDefined()
   @IsBoolean()
   is_delivered: boolean;

   delivery_details?: DeliveryDetails;
}

export class CreateMasterOrderDto implements Partial<Order> {
   @IsDefined()
   @IsString()
   phone_number: string;

   @IsDefined()
   cart: DatabaseCartProduct[];

   @IsDefined()
   @IsBoolean()
   is_delivered: boolean;

   @IsDefined()
   @IsBoolean()
   is_delivered_asap: boolean;

   @IsDefined()
   @IsDate()
   delivered_at: Date;

   delivery_details?: DeliveryDetails;

   @IsDefined()
   @IsString()
   verified_fullname: string;
}
