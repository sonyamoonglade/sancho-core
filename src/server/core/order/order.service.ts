import {Inject, Injectable} from "@nestjs/common";
import {CreateMasterOrderDto, CreateUserOrderDto} from "./dto/create-order.dto";
import {ValidationService} from "../validation/validation.service";
import {UserService} from "../user/user.service";
import {OrderRepository} from "./order.repository";
import {Response} from "express";
import {extendedRequest} from "../types/types";
import {Order, orders} from "../entities/Order";
import {UnexpectedServerError} from "../exceptions/unexpected-errors.exceptions";
import {JsonService} from "../database/json.service";
import {User, users} from "../entities/User";
import {VerifyOrderDto} from "./dto/verify-order.dto";
import {CancelOrderDto} from "./dto/cancel-order.dto";
import {CancelExplanationHasNotBeenProvided, OrderCannotBeVerified} from "../exceptions/order.exceptions";
import {Product, products} from "../entities/Product";
import {ProductRepository} from "../product/product.repository";
import {
  AppRoles,
  DatabaseCartProduct, OrderQueue, OrderStatus,
  ResponseUserOrder, VerifiedQueueOrder,
  WaitingQueueOrder
} from "../../../common/types";
import {CookieService} from "../../shared/cookie/cookie.service";
import {DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE} from "../../../common/constants";
import {EventEmitter} from "events";
import {ORDER_HAS_CREATED, ORDER_QUEUE_HAS_MODIFIED} from "../../types/types";

@Injectable()
export class OrderService {

  private events: EventEmitter

  constructor(private validationService:ValidationService,
              private orderRepository:OrderRepository,
              private userService:UserService,
              private jsonService:JsonService,
              private productRepository:ProductRepository,
              private cookieService: CookieService,
              ) {
    this.events = new EventEmitter()
  }

  public async createUserOrder(createUserOrderDto:CreateUserOrderDto, res:Response,req: extendedRequest){

    const {user_id} = req

    try {

      let total_cart_price = await this.calculateTotalCartPrice(createUserOrderDto.cart)
      total_cart_price = this.applyDeliveryPunishment(total_cart_price)

      const userOrder:Order = {
        total_cart_price,
        ...createUserOrderDto,
        user_id,
        status:OrderStatus.waiting_for_verification,
        created_at: new Date(Date.now())
      }


      const createdOrder = await this.orderRepository.save(userOrder)

      if(userOrder.is_delivered === true){
        const stringDetails: string = JSON.stringify(userOrder.delivery_details)
        await this.userService.updateUsersRememberedDeliveryAddress(user_id,stringDetails)
      }
      
      const responseOrder:ResponseUserOrder = {
        id: createdOrder.id,
        cart: userOrder.cart,
        created_at: userOrder.created_at,
        status: userOrder.status,
        is_delivered: userOrder.is_delivered,
        delivery_details: userOrder.delivery_details ? userOrder.delivery_details : null,
        total_cart_price
      }
      this.events.emit(ORDER_HAS_CREATED)
      return res.status(201).send({order:responseOrder})
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  public async createMasterOrder(res:Response, createMasterOrderDto:CreateMasterOrderDto){

    try {

      let user_id = await this.userService.getUserId(createMasterOrderDto.phone_number)

      if(!user_id){
        const registeredUser:User = await this.userService
          .createUser(
            res,
            { phone_number: createMasterOrderDto.phone_number },
            true) as User

        user_id = registeredUser.id
      }
      let total_cart_price = await this.calculateTotalCartPrice(createMasterOrderDto.cart)
      total_cart_price = this.applyDeliveryPunishment(total_cart_price)

      const masterOrder:Order = {
        ...createMasterOrderDto,
        total_cart_price,
        user_id,
        status:OrderStatus.verified,
        created_at: new Date(Date.now()),
        verified_at: new Date(Date.now())
      }

      this.jsonService.stringifyNestedObjects(masterOrder)

      await this.orderRepository.save(masterOrder)

      const responseOrder:Partial<Order> = {
        cart: masterOrder.cart,
        verified_fullname: masterOrder.verified_fullname,
        created_at: masterOrder.created_at,
        status: masterOrder.status,
        is_delivered: masterOrder.is_delivered,
        delivery_details: masterOrder.delivery_details ? masterOrder.delivery_details : null,
        total_cart_price
      }
      this.events.emit(ORDER_HAS_CREATED)
      return res.status(201).send({order:responseOrder})

    }catch (e){
      throw new UnexpectedServerError()
    }
  }

  public async verifyOrder(res:Response, verifyOrderDto:VerifyOrderDto){
    try {
      const {phone_number} = verifyOrderDto
      const hw = await this.hasWaitingOrder(null,phone_number)

      const {id: orderId, has} = hw
      if(!has){
        throw new Error(`verification ${phone_number}`)
      }

      const updated:Partial<Order> = {
        verified_fullname:verifyOrderDto.verified_fullname,
        delivery_details:verifyOrderDto?.delivery_details || null,
        status:OrderStatus.verified,
        verified_at: new Date(Date.now()),
      }
      if(verifyOrderDto.is_delivered !== undefined){
        updated.is_delivered = verifyOrderDto.is_delivered
      }
      else if(verifyOrderDto.cart !== undefined){
        updated.cart = verifyOrderDto.cart
        this.jsonService.stringifyNestedObjects(updated)
      }

      await this.orderRepository.update(orderId,updated)
      this.events.emit(ORDER_QUEUE_HAS_MODIFIED)
      return res.status(200).send({status:OrderStatus.verified})
    }catch (e) {
      if(e.message.includes('verification')){
        const phone = e.message.split(' ').pop()
        throw new OrderCannotBeVerified(phone)
      }
      throw new UnexpectedServerError()
    }

  }

  public async cancelOrder(res:Response,req:extendedRequest, cancelOrderDto:CancelOrderDto){

    const {user_id} = req
    const role = await this.userService.getUserRole(user_id)

    // user cancels
    if(!(role == AppRoles.worker || role == AppRoles.master)){
      const {order_id} = cancelOrderDto
      const o = await this.orderRepository.getById(order_id)
      if(o.status !== OrderStatus.waiting_for_verification){
        throw new UnexpectedServerError("Некоректный статус заказа")
      }
      try {
        const updated:Partial<Order> = {
          cancel_explanation: cancelOrderDto.cancel_explanation,
          status:OrderStatus.cancelled,
          cancelled_at: new Date(Date.now()),
          cancelled_by: user_id
        }
        await this.orderRepository.update(o.id,updated)
        this.cookieService.setCanCancelCookie(res,5)
        this.events.emit(ORDER_QUEUE_HAS_MODIFIED)
        return res.status(200).end()
      }catch (e) {
        throw new UnexpectedServerError("Ошибка отмены заказа")
      }
    }
    // worker cancels
    if(!cancelOrderDto.cancel_explanation) {
      throw new CancelExplanationHasNotBeenProvided()
    }

    try {
      const updated:Partial<Order> = {
        cancel_explanation: cancelOrderDto.cancel_explanation,
        status:OrderStatus.cancelled,
        cancelled_at: new Date(Date.now()),
        cancelled_by: user_id
      }

      await this.orderRepository.update(cancelOrderDto.order_id,updated)
      const cancelWorkerLogin:string = await this.userService.getMasterLogin(user_id)
      this.events.emit(ORDER_QUEUE_HAS_MODIFIED)
      return res.status(200).send(
          {message:`Заказ ${cancelOrderDto.order_id} успешно отменен! Отменил - ${cancelWorkerLogin}`
        })
    }catch (e) {
      throw new UnexpectedServerError("Ошибка отмены заказа")
    }
  }

  public async userOrderHistory(res:Response,req:extendedRequest,to: number){

    const {user_id} = req

    const sql = `select * from ${orders} where user_id=${user_id}`

    let userOrders:Order[] | ResponseUserOrder[] = await this.orderRepository.customQuery(sql)

    userOrders = userOrders.map((o) => {
        const {
          total_cart_price,
          id,
          created_at,
          status,
          is_delivered,
          delivery_details,
          cart
        } = o
        const rso:ResponseUserOrder = {
          total_cart_price,
          id,
          created_at,
          status,
          is_delivered,
          delivery_details,
          cart
        }
      return rso
    })

    const ol = userOrders.length

    let slice: ResponseUserOrder[]
    let hasMore: boolean
    switch (true){
      case to == 10 && to < ol:
        slice = userOrders.slice(0, to)
        hasMore = true
        break;
      case to == 10 && to > ol:
        slice = userOrders.slice(0, ol)
        hasMore = false
        break
      case to > ol:
        slice = userOrders.slice(to - 9,ol)
        hasMore = false
        break
      case to < ol:
        slice = userOrders.slice(to - 9, to)
        hasMore = true
        break
    }


    res.status(200).send({orders:slice, hasMore})

  }

  public async getLastVerifiedOrder(user_id:number):Promise<Order | undefined>{
    const ord = (await this.orderRepository.get({where:{user_id}}))[0]
    return ord
  }

  public async hasWaitingOrder(user_id: number, phone_number?:string):Promise<{id: number | null, has: boolean}>{

    if(!phone_number) {
      const ord = (await this.orderRepository.get({ where: {
        user_id, status:OrderStatus.waiting_for_verification },returning:["id"]}
      ))[0]
      if(ord === undefined){
        return {
          id: null,
          has: false
        }
      }
      return {
        id: ord.id,
        has: true
      }
    }

    const sql = `
        select o.id from ${orders} o join ${users} u on o.user_id=u.id
        where u.phone_number='${phone_number}' and o.status = '${OrderStatus.waiting_for_verification}'
      `
    const ord = (await this.orderRepository.customQuery(sql))[0]
    if(ord === undefined){
      return {
        id: null,
        has: false
      }
    }
    return {
      id: ord.id,
      has: true
    }

  }

  public async calculateTotalCartPrice(cart:DatabaseCartProduct[]):Promise<number>{
    // select from products where id = 1 or id = 2 or id = 5
    const product_ids = []

    for(const product of cart){
      product_ids.push(product.id)
    }
    const key = 'id'
    const statements = []
    let i = 0;
    for(const p_id of product_ids){

      let statement;
      if(i == product_ids.length - 1){
        statement = `${key} = ${p_id}`
      }else{
        statement = `${key} = ${p_id} or`
      }
      i++

      statements.push(statement)
    }


    const SQL = `select price,id from ${products} where ${statements.join(' ')}`
    try {
      const products:Product[] = await this.productRepository.customQuery(SQL)
      const total_cart_price = products.reduce((a,c) => {
        const same_product_idx = cart.findIndex(p => p.id == c.id)
        const product_quantity = cart[same_product_idx].quantity
        a += c.price * product_quantity
        return a
      },0)

      return total_cart_price

    }catch (e) {

      throw new UnexpectedServerError()
    }

  }

  public async orderQueue(res: Response) {


    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache"
    })


    this.events.on(ORDER_HAS_CREATED, async () => {
      const queue = await this.fetchOrderQueue()
      const chunk = `data: ${JSON.stringify({queue})}\n\n`
      return res.write(chunk)
    })

    this.events.on(ORDER_QUEUE_HAS_MODIFIED, async () => {
      const queue = await this.fetchOrderQueue()
      const chunk = `data: ${JSON.stringify({queue})}\n\n`
      return res.write(chunk)
    })

    res.on("close", () => {
      console.log("closing queue conn..")
      this.events.removeAllListeners()
      res.end()
    })


  }

  private async fetchOrderQueue(): Promise<OrderQueue> {
    const sql = `
        select o.id,o.cart,o.total_cart_price,o.status,o.is_delivered,o.delivery_details,o.created_at,
        o.verified_fullname,u.phone_number from ${orders} o join ${users} u on o.user_id= 
        u.id where o.status = '${OrderStatus.waiting_for_verification}' or o.status = '${OrderStatus.verified}'
      `
    const result: VerifiedQueueOrder[] = await this.orderRepository.customQuery(sql)

    const queue = this.mapOrdersToQueueTypes(result)
    return queue
  }


  public async initialQueue(res: Response){
    try {
      const queue = await this.fetchOrderQueue()

      res.status(200).send({queue})
    }catch (e) {
      throw new UnexpectedServerError("queue err")
    }
  }


  mapOrdersToQueueTypes(orders:VerifiedQueueOrder[]):OrderQueue{
    //map waitings
    const w = orders
        .filter(o => o.status === OrderStatus.waiting_for_verification)
        .map(o => {
          const f:WaitingQueueOrder = {
            cart:o.cart,
            created_at:o.created_at,
            total_cart_price: o.total_cart_price,
            status: o.status,
            is_delivered: o.is_delivered,
            delivery_details: (o.is_delivered ? JSON.parse(o.delivery_details as unknown as string) : null),
            id: o.id,
            phone_number: o.phone_number,
          }
          return f
        })
    // map verified
    const v = orders
        .filter(o => o.status === OrderStatus.verified)
        .map(o => {
          return {
            ...o,
            delivery_details: (o.is_delivered ? JSON.parse(o.delivery_details as unknown as string) : null)
          }
        })

    return {
      waiting: w,
      verified: v
    }
  }

  applyDeliveryPunishment(p: number){
    if(p <= DELIVERY_PUNISHMENT_THRESHOLD){
      return p + DELIVERY_PUNISHMENT_VALUE
    }

    return p
  }

}
