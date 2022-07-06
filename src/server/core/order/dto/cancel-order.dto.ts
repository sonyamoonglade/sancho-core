import { IsDefined, IsNumber, IsString } from "class-validator";
import { AppRoles } from "../../../../common/types";

export class CancelOrderDto {
   @IsDefined()
   @IsNumber()
   order_id: number;

   @IsDefined()
   @IsString()
   cancel_explanation: string;

   role: AppRoles;
}
