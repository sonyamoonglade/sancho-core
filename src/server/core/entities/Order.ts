import { DatabaseCartProduct, DeliveryDetails, OrderStatus, Pay } from "../../../common/types";

export type Order = {
   id?: number;
   user_id: number;
   cart: DatabaseCartProduct[];
   total_cart_price: number;
   status: OrderStatus;
   is_delivered: boolean;
   is_delivered_asap: boolean;
   delivery_details?: DeliveryDetails;
   created_at: Date;
   pay: Pay;
   verified_at?: Date;
   is_paid?: boolean;
   completed_at?: Date;
   cancelled_at?: Date;
   cancelled_by?: number;
   cancel_explanation?: string;
};

export type DeliveryOrder = {
   order_id: number;
   delivery_details: DeliveryDetails;
   total_cart_price: number;
   pay: Pay;
   is_delivered_asap: boolean;
   is_paid: boolean;
};

export type CheckOrder = {
   order_id: number;
   total_cart_price: number;
   pay: Pay;
   cart: DatabaseCartProduct[];
   delivery_details?: DeliveryDetails;
   is_delivered: boolean;
};

export class LastVerifiedOrder {
   created_at: Date;
   id: number;
   status: OrderStatus;
}

export const orders = "orders";
