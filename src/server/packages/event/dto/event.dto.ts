import { IsDefined, IsNumber, IsString } from "class-validator";

export class CreateSubscriptionDto {
   @IsDefined()
   @IsString()
   phone_number: string;

   @IsDefined()
   @IsString()
   event_name: string;
}

export class RegisterSubscriberDto {
   @IsDefined()
   @IsString()
   phone_number: string;
}
