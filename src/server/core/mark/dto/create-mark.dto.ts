import { IsBoolean, IsDefined, IsNumber, IsString } from "class-validator";

export class CreateMarkDto {
   @IsDefined()
   @IsString()
   content: string;

   isImportant: boolean;

   @IsDefined()
   @IsNumber()
   userId: number;
}
