import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { SessionService } from "../../authentication/session.service";
import { OrderService } from "../../order/order.service";
import { LastOrderIsNotYetVerified } from "../../../packages/exceptions/order.exceptions";

@Injectable()
export class PreventAuthedGuard implements CanActivate {
   constructor(private sessionService: SessionService, private orderService: OrderService) {}
   async canActivate(ctx: ExecutionContext): Promise<boolean> {
      // prevents users with sid to login with non-verified order

      const req: Request = ctx.switchToHttp().getRequest();

      const { SID } = req.cookies;
      if (SID === undefined) {
         return true;
      }
      try {
         const userId = await this.sessionService.getUserIdBySID(SID);
         const { has } = await this.orderService.hasWaitingOrder(userId, null);
         if (!has) {
            return true;
         }
      } catch (e) {}

      throw new LastOrderIsNotYetVerified();
   }
}
