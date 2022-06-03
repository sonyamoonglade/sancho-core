import {AppRoles} from "../../../../common/types";


export class CreateMasterUserDto{
  login: string
  password: string
  role: AppRoles
}