import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AppRoles} from "../../../common/types";
import {UserService} from "../user/user.service";
import {extendedRequest} from "../types/types";
import {ROLES_META_KEY} from "../decorators/metadata.keys";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private userService:UserService, private reflector:Reflector) {
  }
  async canActivate(context: ExecutionContext):  Promise<boolean> {

      const req:extendedRequest = context.switchToHttp().getRequest()
      if(req.url.endsWith("/catalogProducts")) { return true }

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