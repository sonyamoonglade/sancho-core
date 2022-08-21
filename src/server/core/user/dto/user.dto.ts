import { IsDefined, IsString, MinLength } from "class-validator";

export class BanWorkerInput {
   @IsDefined()
   @IsString()
   @MinLength(15)
   login: string;
}
