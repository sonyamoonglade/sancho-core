import { IsDefined, IsNumber, IsString } from "class-validator";
import { DeliveryOrder } from "../../entities/Order";
import { DeliveryUser } from "../../entities/User";

export class CreateDeliveryDtoFrontend {
   @IsDefined()
   @IsNumber()
   order_id: number;
}

export class CreateDeliveryDto {
   @IsDefined()
   order: DeliveryOrder;

   @IsDefined()
   user: DeliveryUser;
}
export class RegisterRunnerDto {
   @IsDefined()
   @IsString()
   username: string;

   @IsDefined()
   @IsString()
   phone_number: string;
}
