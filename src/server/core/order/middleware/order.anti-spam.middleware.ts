import {Injectable, NestMiddleware} from "@nestjs/common";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import {Order} from "../../entities/Order";
import {LastOrderIsNotYetVerified, OrderCreationLimitExceeded} from "../../exceptions/order.exceptions";
import {OrderService} from "../order.service";
import {OrderStatus} from "../../../../common/types";


@Injectable()

export class OrderAntiSpamMiddleware implements NestMiddleware {
  constructor(private orderService:OrderService) {
    dayjs.extend(relativeTime)
  }
  async use(req: any, res: any, next: (error?: any) => void) {
    // for masters extract phone from dto
    const {user_phone} = req.body
    if(user_phone){
      // worker creates an order
      // get the last verfified order and check if verif date is 5min away from current!
      const lastVerifiedOrder = await this.orderService.lastVerifiedOrder(user_phone)
      if(!lastVerifiedOrder) return next()

      const {afterRate, minutesLeft, now} = this.handleVerifiedOrderTimeOperations(lastVerifiedOrder)
      if(afterRate > now) throw new OrderCreationLimitExceeded(minutesLeft)

      return next()

    }
    // user creates an order
    // get the last non-approved order and wait until last order is either cancelled or verified
    const {user_id} = req
    const lastWaitingOrder = await this.orderService.lastWaitingOrder(user_id)
    if(!lastWaitingOrder) return next()

    if(lastWaitingOrder.status == OrderStatus.waiting_for_verification){
      throw new LastOrderIsNotYetVerified()
    }

    return next()

  }


  handleVerifiedOrderTimeOperations(order:Order){
    const creationTime = dayjs(order.created_at)
    const now = dayjs()

    const orderCreationRateTime:number = Number(process.env.ORDER_CREATION_TIME) || 5

    const afterRate = creationTime.add(orderCreationRateTime,'minutes')
    const remainingTime = now.to(afterRate)
    const minutesLeft = Number(remainingTime.split(' ')[1])

    return {minutesLeft,afterRate,remainingTime, now}
  }



}