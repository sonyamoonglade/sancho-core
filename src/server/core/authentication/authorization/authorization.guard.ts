import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {extendedRequest} from "../../types/types";
import {UserService} from "../../user/user.service";
import {Reflector} from "@nestjs/core";
import {ROLES_META_KEY} from "../../decorators/metadata.keys";
import {AppRoles} from "../../../../common/types";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private userService:UserService, private reflector:Reflector) {
  }
  async canActivate(context: ExecutionContext):  Promise<boolean> {

      const req:extendedRequest = context.switchToHttp().getRequest()
      const {user_id} = req
      try {
        const userRole = (await this.userService.getUserRole(user_id))

        const handlerRoles:string[] = this.reflector.get(ROLES_META_KEY, context.getHandler())

        return handlerRoles.includes(userRole) || userRole == AppRoles.master
      }catch (e) {
        return false
      }


  }
}