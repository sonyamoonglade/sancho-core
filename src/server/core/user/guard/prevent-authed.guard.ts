import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { SessionService } from "../../session/session.service";
import { OrderService } from "../../order/order.service";
import { LastOrderIsNotYetVerified } from "../../../packages/exceptions/order.exceptions";
import { PinoLogger } from "nestjs-pino";

@Injectable()
// prevents users with sid to login with non-verified order
export class PreventAuthedGuard implements CanActivate {
   constructor(private sessionService: SessionService, private orderService: OrderService, private logger: PinoLogger) {
      this.logger.setContext(PreventAuthedGuard.name);
   }
   async canActivate(ctx: ExecutionContext): Promise<boolean> {
      this.logger.debug("guard for prevent auth");
      const req: Request = ctx.switchToHttp().getRequest();

      const { SID } = req.cookies;
      if (SID === undefined) {
         this.logger.debug("ok");
         return true;
      }
      try {
         const userId = await this.sessionService.getUserIdBySID(SID);
         const { ok } = await this.orderService.hasWaitingOrder(userId, null);
         if (!ok) {
            this.logger.debug("ok");
            return true;
         }
      } catch (e) {
         this.logger.error(e);
         return false;
      }
      //Instead of return 'false'
      this.logger.debug("fail");
      throw new LastOrderIsNotYetVerified();
   }
}
