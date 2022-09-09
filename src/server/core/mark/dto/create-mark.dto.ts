import { IsBoolean, IsDefined, IsString } from "class-validator";

export class CreateMarkInput {
   @IsDefined()
   @IsString()
   content: string;

   @IsDefined()
   @IsBoolean()
   isImportant: boolean;

   @IsDefined()
   @IsString()
   phoneNumber: string;
}

export class CreateMarkDto {
   content: string;
   isImportant: boolean;
   userId: number;
}
