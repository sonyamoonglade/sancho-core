import { DatabaseCartProduct, DeliveryDetails, OrderStatus, Pay } from "../../../../common/types";
import { IsBoolean, IsDefined, IsString, MaxLength } from "class-validator";

export class CreateUserOrderInput {
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

   email?: string;
   username?: string;
   promo?: string;
   delivery_details?: DeliveryDetails;
}
export class CreateUserOrderDto {
   pay: Pay;
   is_delivered: boolean;
   delivery_details?: DeliveryDetails;
   is_delivered_asap: boolean;
   cart: DatabaseCartProduct[];
   status: OrderStatus.waiting_for_verification;
   user_id: number;

   total_cart_price?: number;
}
export class CreateMasterOrderDto {
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
