import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../user/user.service";
import { extendedRequest } from "../../types/types";
import { ROLES_META_KEY } from "../../packages/decorators/metadata.keys";
import { AppRoles } from "../../../common/types";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class AuthorizationGuard implements CanActivate {
   constructor(private userService: UserService, private reflector: Reflector, private logger: PinoLogger) {
      this.logger.setContext(AuthorizationGuard.name);
   }
   async canActivate(context: ExecutionContext): Promise<boolean> {
      this.logger.debug("authorization guard");

      const req: extendedRequest = context.switchToHttp().getRequest();
      //Fine for catalog requests but none of admin requests
      if (req.url.endsWith("/catalog") && !req.url.split("/").includes("admin")) {
         this.logger.debug("ends with catalog");
         return true;
      }

      const { user_id } = req;
      try {
         const userRole = await this.userService.getUserRole(user_id);
         this.logger.debug(`user role: ${userRole}`);

         const handlerRoles: string[] = this.reflector.get(ROLES_META_KEY, context.getHandler());
         this.logger.debug(`handler roles: ${handlerRoles}`);

         return handlerRoles.includes(userRole) || userRole == AppRoles.master;
      } catch (e) {
         return false;
      }
   }
}
