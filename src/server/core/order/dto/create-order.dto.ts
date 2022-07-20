import { Order } from "../../entities/Order";
import { DatabaseCartProduct, DeliveryDetails, Pay } from "../../../../common/types";
import { IsBoolean, IsDate, IsDateString, IsDefined, IsString, MaxLength } from "class-validator";

export class CreateUserOrderDto implements Partial<Order> {
   @IsDefined()
   cart: DatabaseCartProduct[];

   @IsDefined()
   @IsBoolean()
   is_delivered_asap: boolean;

   @IsDefined()
   @IsBoolean()
   is_delivered: boolean;

   @IsDefined()
   @IsString()
   pay: Pay;

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
   @IsString()
   pay: Pay;

   @IsDefined()
   @IsString()
   @MaxLength(30)
   username: string;

   delivered_at: Date | null = null;
   delivery_details?: DeliveryDetails | null = null;
   userId: number;
   total_cart_price: number;
}
