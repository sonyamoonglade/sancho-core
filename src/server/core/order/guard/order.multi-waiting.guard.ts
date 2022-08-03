import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { OrderService } from "../order.service";
import { LastOrderIsNotYetVerified } from "../../../packages/exceptions/order.exceptions";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class MultiWaitingOrderGuard implements CanActivate {
   constructor(private orderService: OrderService, private logger: PinoLogger) {
      this.logger.setContext(MultiWaitingOrderGuard.name);
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
         const req = context.switchToHttp().getRequest();
         const { user_id } = req;
         this.logger.debug("guard for multi-waiting orders");
         // User creates an order
         // Get the last non-approved order and wait until last order is either cancelled or verified
         const { ok } = await this.orderService.hasWaitingOrder(user_id, null);
         if (ok) {
            this.logger.debug("fail");
            throw new LastOrderIsNotYetVerified();
         }
         this.logger.debug("ok");
         return true;
      } catch (e) {
         throw e;
      }
   }
}
