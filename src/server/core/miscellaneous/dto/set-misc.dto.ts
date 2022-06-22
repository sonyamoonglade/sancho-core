import { IsDefined, IsNumber } from "class-validator";

export class SetMiscDto {
   @IsDefined()
   @IsNumber()
   delivery_punishment_value: number;

   @IsDefined()
   @IsNumber()
   delivery_punishment_threshold: number;

   @IsDefined()
   @IsNumber()
   order_creation_delay: number;
}
