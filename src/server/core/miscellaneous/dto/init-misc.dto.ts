import { IsDefined, IsNumber } from "class-validator";

export class InitMiscDto {
   @IsDefined()
   @IsNumber()
   delivery_punishment_value: number;

   @IsDefined()
   @IsNumber()
   delivery_punishment_threshold: number;

   @IsDefined()
   @IsNumber()
   order_creation_delay: number;

   @IsDefined()
   @IsNumber()
   reg_cust_threshold: number;

   @IsDefined()
   @IsNumber()
   reg_cust_duration: number;

   @IsDefined()
   @IsNumber()
   cancel_ban_duration: number;
}
