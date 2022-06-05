import {DeliveryDetails} from "../../../../common/types";
import {IsDefined, IsString} from "class-validator";

export class RegisterUserDto {


  deliveryAddress?: DeliveryDetails

  @IsDefined()
  @IsString()
  phone_number: string

}