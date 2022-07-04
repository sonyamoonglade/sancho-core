import { AppRoles } from "../../../../common/types";
import { IsDefined, IsString } from "class-validator";

export class CreateMasterUserDto {
   @IsDefined()
   @IsString()
   login: string;

   @IsDefined()
   @IsString()
   password: string;

   @IsDefined()
   @IsString()
   role: AppRoles;

   @IsDefined()
   @IsString()
   name: string;
}
