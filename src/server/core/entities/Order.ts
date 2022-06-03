import {DatabaseCartProduct, DeliveryDetails, OrderStatus} from "../../../common/types";

export type Order = {
  id?: number
  user_id: number
  phone_number: string
  cart: DatabaseCartProduct[]
  total_cart_price: number
  status: OrderStatus
  is_delivered: boolean
  delivery_details?: DeliveryDetails
  created_at: Date
  verified_at?: Date
  verified_fullname?: string
  completed_at?: Date
  cancelled_at?: Date
  cancelled_by?: number
  cancel_explanation?: string
}

export const orders = 'orders'