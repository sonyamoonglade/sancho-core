import { IsDefined, IsString } from "class-validator";

export class RegisterUserDto {
   @IsDefined()
   @IsString()
   phone_number: string;
}
