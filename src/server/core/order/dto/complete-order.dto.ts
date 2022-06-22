import { IsDefined, IsNumber } from "class-validator";

export class CompleteOrderDto {
   @IsDefined()
   @IsNumber()
   order_id: number;
}
