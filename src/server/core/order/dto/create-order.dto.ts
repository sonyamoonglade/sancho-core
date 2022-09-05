import { DatabaseCartProduct, DeliveryDetails, OrderStatus, Pay } from "../../../../common/types";
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

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
   created_at: Date;
   amount: number;
}

export class CreateMasterOrderInput {
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

   @IsOptional()
   @IsNumber()
   discount: number = 0;

   delivered_at: Date | null = null;
   delivery_details?: DeliveryDetails | null = null;
   userId: number;
}
export class CreateMasterOrderDto {
   user_id: number;
   phone_number: string;
   cart: DatabaseCartProduct[];
   pay: Pay;
   is_delivered_asap: boolean;
   is_delivered: boolean;
   verified_at: Date;
   amount: number;
   discount: number;
   discounted_amount: number;
   delivery_details?: DeliveryDetails | null = null;
   delivered_at: Date | null = null;
   created_at: Date;
}
