import { DatabaseCartProduct, DeliveryDetails, OrderStatus } from "../../../common/types";

export type Order = {
   id?: number;
   user_id: number;
   cart: DatabaseCartProduct[];
   total_cart_price: number;
   status: OrderStatus;
   is_delivered: boolean;
   delivered_at?: Date;
   is_delivered_asap: boolean;
   delivery_details?: DeliveryDetails;
   created_at: Date;
   verified_at?: Date;
   is_paid?: boolean;
   completed_at?: Date;
   cancelled_at?: Date;
   cancelled_by?: number;
   cancel_explanation?: string;
};

export const orders = "orders";
