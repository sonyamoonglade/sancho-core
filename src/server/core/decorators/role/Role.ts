import {SetMetadata} from "@nestjs/common";
import {ROLES_META_KEY} from "../metadata.keys";
import {AppRoles} from "../../../../common/types";
import {log} from "util";


export function Role(roles: AppRoles[]){
  return SetMetadata(ROLES_META_KEY,roles)
}