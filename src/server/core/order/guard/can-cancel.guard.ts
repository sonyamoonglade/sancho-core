import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Request} from "express";
import {extendedRequest} from "../../types/types";
import {UserService} from "../../user/user.service";
import {AppRoles} from "../../../../common/types";
import {CookieNames} from "../../../types/types";


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
            const name = CookieNames.cancelBan
            const ban = req.cookies[name]

            if(ban == undefined) { return true }

            return false

        }catch (e) {
            return false
        }




    }

}