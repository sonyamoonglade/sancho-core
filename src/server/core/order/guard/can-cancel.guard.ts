import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {UserService} from "../../user/user.service";
import {AppRoles} from "../../../../common/types";
import {CookieNames, extendedRequest} from "../../../types/types";


@Injectable()
export class CanCancelGuard implements CanActivate {

    constructor(private userService:UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{

        const req:extendedRequest = context.switchToHttp().getRequest()

        const {user_id} = req
        try {
            const role = await this.userService.getUserRole(user_id)
            if(role === AppRoles.worker || role ===AppRoles.master){
                return true
            }
            const ban = req.cookies[CookieNames.cancelBan]

            if(ban == undefined) { return true }

            return false

        }catch (e) {
            return false
        }




    }

}