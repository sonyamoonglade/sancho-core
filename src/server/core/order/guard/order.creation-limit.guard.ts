import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AppRoles } from "../../../../common/types";
import { CreateMasterOrderDto } from "../dto/create-order.dto";
import { LastVerifiedOrderDto } from "../dto/order.dto";
import { OrderCreationLimitExceeded } from "../../../shared/exceptions/order.exceptions";
import { OrderService } from "../order.service";
import { Order } from "../../entities/Order";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";

@Injectable()
export class CreationLimitGuard implements CanActivate {
   constructor(private orderService: OrderService) {
      dayjs.extend(relativeTime);
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();

      // createMasterOrder dto (worker creates an order)
      // get the last verfified order and check if verif date is 5min away from current!
      const dto: CreateMasterOrderDto = req.body;
      const phoneNumber: string = dto.phone_number;
      const lw: LastVerifiedOrderDto = await this.orderService.getLastVerifiedOrder(phoneNumber);
      if (lw === undefined) {
         return true;
      }

      const { afterRate, minutesLeft, now } = this.handleVerifiedOrderTimeOperations(lw);
      if (afterRate > now) {
         throw new OrderCreationLimitExceeded(minutesLeft);
      }

      return true;
   }

   handleVerifiedOrderTimeOperations(order: Partial<Order>) {
      const creationTime = dayjs(order.created_at);
      const now = dayjs();
      const orderCreationRateTime: number = Number(process.env.ORDER_CREATION_TIME) || 5;

      const afterRate = creationTime.add(orderCreationRateTime, "minutes");
      const remainingTime = now.to(afterRate); // e.g. in 5 minutes, in few seconds (two cases)
      let minutesLeft = Number(remainingTime.split(" ")[1]);

      if (Number.isNaN(minutesLeft)) {
         minutesLeft = 1;
      }

      return { minutesLeft, afterRate, remainingTime, now };
   }
}
