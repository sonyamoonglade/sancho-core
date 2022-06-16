import {Injectable, NestMiddleware} from "@nestjs/common";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import {Order} from "../../entities/Order";
import {OrderService} from "../order.service";
import {AppRoles} from "../../../../common/types";
import {UserService} from "../../user/user.service";
import {LastOrderIsNotYetVerified, OrderCreationLimitExceeded} from "../../../shared/exceptions/order.exceptions";


@Injectable()

export class OrderAntiSpamMiddleware implements NestMiddleware {
  constructor(
      private orderService:OrderService,
      private userService:UserService
  ) {
    dayjs.extend(relativeTime)
  }
  async use(req: any, res: any, next: (error?: any) => void) {
    const {user_id} = req

    const role = await this.userService.getUserRole(user_id)
    // createMasterOrder dto (master | worker creates an order)
    if(role !== AppRoles.user){
      // get the last verfified order and check if verif date is 5min away from current!
      const lw = await this.orderService.getLastVerifiedOrder(user_id)
      if(!lw) return next()

      const {afterRate, minutesLeft, now} = this.handleVerifiedOrderTimeOperations(lw)
      if(afterRate > now) throw new OrderCreationLimitExceeded(minutesLeft)

      return next();
    }
    // user creates an order
    // get the last non-approved order and wait until last order is either cancelled or verified
    const {has} = await this.orderService.hasWaitingOrder(user_id, null)
    if(!has) return next()

    throw new LastOrderIsNotYetVerified()
  }


  handleVerifiedOrderTimeOperations(order:Partial<Order>){
    const creationTime = dayjs(order.created_at)
    const now = dayjs()

    const orderCreationRateTime:number = Number(process.env.ORDER_CREATION_TIME) || 5

    const afterRate = creationTime.add(orderCreationRateTime,'minutes')
    const remainingTime = now.to(afterRate)
    const minutesLeft = Number(remainingTime.split(' ')[1])

    return {minutesLeft,afterRate,remainingTime, now}
  }



}