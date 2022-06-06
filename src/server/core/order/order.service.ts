import {Injectable} from "@nestjs/common";
import {CreateMasterOrderDto, CreateUserOrderDto} from "./dto/create-order.dto";
import {ValidationService} from "../validation/validation.service";
import {UserService} from "../user/user.service";
import {OrderRepository} from "./order.repository";
import {Response} from "express";
import {extendedRequest} from "../types/types";
import {Order, orders} from "../entities/Order";
import {UnexpectedServerError} from "../exceptions/unexpected-errors.exceptions";
import {JsonService} from "../database/json.service";
import {User} from "../entities/User";
import {ValidationErrorException} from "../exceptions/validation.exceptions";
import {VerifyOrderDto} from "./dto/verify-order.dto";
import {CancelOrderDto} from "./dto/cancel-order.dto";
import {CancelExplanationHasNotBeenProvided, OrderCannotBeVerified} from "../exceptions/order.exceptions";
import {Product, products} from "../entities/Product";
import {ProductRepository} from "../product/product.repository";
import {AppRoles, DatabaseCartProduct, OrderStatus, ResponseUserOrder} from "../../../common/types";
import {CookieService} from "../../shared/cookie/cookie.service";
import {DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE} from "../../../common/constants";

@Injectable()
export class OrderService {


  constructor(private validationService:ValidationService,
              private orderRepository:OrderRepository,
              private userService:UserService,
              private jsonService:JsonService,
              private productRepository:ProductRepository,
              private cookieService: CookieService
              ) {
  }

  async createUserOrder(createUserOrderDto:CreateUserOrderDto, res:Response,req: extendedRequest){

    const {user_id} = req

    try {
      const userPhoneNumber = await this.userService.getUserPhone(user_id)
      // calculate total_cart_price and include delivery punish if price tl

      let total_cart_price = await this.calculateTotalCartPrice(createUserOrderDto.cart)


      total_cart_price = this.applyDeliveryPunishment(total_cart_price)
      const userOrder:Order = {
        total_cart_price,
        ...createUserOrderDto,
        user_id,
        phone_number:userPhoneNumber,
        status:OrderStatus.waiting_for_verification,
        created_at: new Date(Date.now())
      }

      const createdOrder = await this.orderRepository.save(userOrder)
      const responseOrder:ResponseUserOrder = {
        id: createdOrder.id,
        cart: userOrder.cart,
        created_at: userOrder.created_at,
        status: userOrder.status,
        is_delivered: userOrder.is_delivered,
        delivery_details: userOrder.delivery_details ? userOrder.delivery_details : null,
        total_cart_price
      }
      return res.status(201).send({order:responseOrder})
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async createMasterOrder(res:Response, createMasterOrderDto:CreateMasterOrderDto){

    const validationResult = this.validationService.validateObjectFromSqlInjection(createMasterOrderDto)
    && this.validationService.validatePhoneNumber(createMasterOrderDto.phone_number)
    if(!validationResult) throw new ValidationErrorException()

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
        phone_number:masterOrder.phone_number,
        verified_fullname: masterOrder.verified_fullname,
        created_at: masterOrder.created_at,
        status: masterOrder.status,
        is_delivered: masterOrder.is_delivered,
        delivery_details: masterOrder.delivery_details ? masterOrder.delivery_details : null,
        total_cart_price
      }

      return res.status(201).send({order:responseOrder})

    }catch (e){
      throw new UnexpectedServerError()
    }
  }

  async verifyOrder(res:Response, verifyOrderDto:VerifyOrderDto){
    try {
      const {phone_number} = verifyOrderDto
      const lastOrder:Order = await this.lastWaitingOrder(null,phone_number)
      //todo CHANGE USER_PHONE TO PHONE NUMBER

      if(lastOrder.status !== OrderStatus.waiting_for_verification){
        throw new Error(`verification ${lastOrder.phone_number}`)
      }
      let cart;
      if(verifyOrderDto.cart){
        cart = verifyOrderDto.cart
        console.log(cart)
      }else {
        cart = lastOrder.cart.map(item => JSON.parse(item as unknown as string))
      }

      let recalculatedTotalCartPrice = await this.calculateTotalCartPrice(cart)
      recalculatedTotalCartPrice = this.applyDeliveryPunishment(recalculatedTotalCartPrice)


      const updated:Partial<Order> = {
        verified_fullname:verifyOrderDto.verified_fullname,
        delivery_details:verifyOrderDto?.delivery_details || null,
        is_delivered: verifyOrderDto?.is_delivered || lastOrder.is_delivered,
        status:OrderStatus.verified,
        verified_at: new Date(Date.now()),
        cart: verifyOrderDto?.cart || lastOrder.cart,
        total_cart_price: recalculatedTotalCartPrice
      }

      this.jsonService.stringifyNestedObjects(updated)

      await this.orderRepository.update(lastOrder.id,updated)

      return res.status(200).send({status:OrderStatus.verified})
    }catch (e) {
      if(e.message.includes('verification')){
        const phone = e.message.split(' ').pop()
        throw new OrderCannotBeVerified(phone)
      }
      throw new UnexpectedServerError()
    }

  }

  async cancelOrder(res:Response,req:extendedRequest, cancelOrderDto:CancelOrderDto){

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
      return res
        .status(200)
        .send(
          {message:`Заказ ${cancelOrderDto.order_id} успешно отменен! Отменил - ${cancelWorkerLogin}`
        })
    }catch (e) {
      throw new UnexpectedServerError("Ошибка отмены заказа")
    }
  }



  async userOrderHistory(res:Response,req:extendedRequest,to: number){

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

  async lastVerifiedOrder(phone_number:string):Promise<Order | undefined>{

    const listOfOrder = await this.orderRepository.get({where:{
      phone_number,status:OrderStatus.verified
    }})
    // ({where: { and:{user_phone,mama}, or:{status:[v1,v2] } } }) ->
    // select .. from .. where user_phone = 12321 and mama =v1 and (status = v1 or status = v2)
    //select from orders where user_phone = +2131923891 and status
    // order -> ascending
    return listOfOrder.pop()


  }

  async lastWaitingOrder(user_id: number, phone_number?:string):Promise<Order | undefined>{

    if(!phone_number) {
      const listOfOrder = await this.orderRepository.get({ where: {
        user_id, status:OrderStatus.waiting_for_verification }
      });
      return listOfOrder.pop()
    }
    const listOfOrder = await this.orderRepository.get({ where: {
        phone_number, status:OrderStatus.waiting_for_verification }
    });
    return listOfOrder.pop()

  }

  async calculateTotalCartPrice(cart:DatabaseCartProduct[]):Promise<number>{
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

  applyDeliveryPunishment(p: number){
    if(p <= DELIVERY_PUNISHMENT_THRESHOLD){
      return p + DELIVERY_PUNISHMENT_VALUE
    }

    return p
  }

}
