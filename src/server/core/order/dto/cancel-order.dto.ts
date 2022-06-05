import {IsDefined, IsNumber, IsString} from "class-validator";

export class CancelOrderDto {

  @IsDefined()
  @IsNumber()
  order_id: number

  @IsDefined()
  @IsString()
  cancel_explanation: string
}