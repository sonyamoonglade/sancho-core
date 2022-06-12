import {DatabaseCartProduct, DeliveryDetails} from "../../../../common/types";
import {IsDefined, IsString} from "class-validator";

export class VerifyOrderDto {

  @IsDefined()
  @IsString()
  verified_fullname: string

  @IsDefined()
  @IsString()
  phone_number: string

  delivery_details?: DeliveryDetails
  is_delivered?: boolean
  cart?: DatabaseCartProduct[]


}