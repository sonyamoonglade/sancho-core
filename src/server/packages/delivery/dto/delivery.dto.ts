import { IsDefined, IsNumber, IsString } from "class-validator";
import { CheckOrder, DeliveryOrder } from "../../../core/entities/Order";
import { CheckUser, DeliveryUser } from "../../../core/entities/User";

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

export class DownloadCheckInput {
   @IsDefined()
   @IsNumber()
   order_id: number;
}

export class DownloadCheckDto {
   order: CheckOrder;
   user: CheckUser;
}
