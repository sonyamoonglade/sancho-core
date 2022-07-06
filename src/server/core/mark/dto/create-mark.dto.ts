import { IsBoolean, IsDefined, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateMarkDto {
   @IsDefined()
   @IsString()
   content: string;

   @IsDefined()
   @IsBoolean()
   isImportant: boolean;

   @IsDefined()
   @IsString()
   phoneNumber: string;

   userId: number;
}
