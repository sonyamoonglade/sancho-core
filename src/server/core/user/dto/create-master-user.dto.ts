import {AppRoles} from "../../../../common/types";
import {IsDefined, IsMimeType, IsString} from "class-validator";


export class CreateMasterUserDto{
  @IsDefined()
  @IsString()
  login: string

  @IsDefined()
  @IsString()
  password: string

  @IsDefined()
  @IsString()
  role: AppRoles
}