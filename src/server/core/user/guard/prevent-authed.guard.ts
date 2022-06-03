import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Request} from "express";
import {SessionService} from "../../authentication/session.service";
import {OrderService} from "../../order/order.service";
import {LastOrderIsNotYetVerified} from "../../exceptions/order.exceptions";


@Injectable()

export class PreventAuthedGuard implements CanActivate {

    constructor(private sessionService: SessionService,
                private orderService: OrderService) {
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req:Request = ctx.switchToHttp().getRequest()
        const {SID} = req.cookies
        if(SID === undefined) { return true }

        const userId = await this.sessionService.getUserIdBySID(SID)
        const wo = await this.orderService.lastWaitingOrder(userId, null)
        if(!wo) { return true }

        throw new LastOrderIsNotYetVerified()

    }

}