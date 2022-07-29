import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { OrderService } from "../order.service";
import { LastOrderIsNotYetVerified } from "../../../packages/exceptions/order.exceptions";

@Injectable()
export class MultiWaitingOrderGuard implements CanActivate {
   constructor(private orderService: OrderService) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const { user_id } = req;

      // User creates an order
      // Get the last non-approved order and wait until last order is either cancelled or verified
      const { has } = await this.orderService.hasWaitingOrder(user_id, null);
      if (has) {
         throw new LastOrderIsNotYetVerified();
      }

      return true;
   }
}
