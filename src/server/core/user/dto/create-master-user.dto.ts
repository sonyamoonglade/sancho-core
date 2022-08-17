import { AppRoles } from "../../../../common/types";
import { IsDefined, IsString } from "class-validator";

export class CreateWorkerUserDto {
   @IsDefined()
   @IsString()
   login: string;

   @IsDefined()
   @IsString()
   password: string;

   role: string = "worker";

   @IsDefined()
   @IsString()
   name: string;
}
