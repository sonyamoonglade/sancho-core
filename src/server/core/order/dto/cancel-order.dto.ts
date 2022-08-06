import { IsDefined, IsNumber, IsString } from "class-validator";
import { OrderStatus } from "../../../../common/types";

export class CancelOrderInput {
   @IsDefined()
   @IsNumber()
   order_id: number;

   @IsDefined()
   @IsString()
   cancel_explanation: string;
}

export class CancelOrderDto {
   id: number;
   cancel_explanation: string;
   cancelled_at: Date;
   status: OrderStatus;
   cancelled_by: number;
}
