import { DatabaseCartProduct, DeliveryDetails, OrderStatus, Pay } from "../../../common/types";
import { IsDefined, IsNumber, IsString } from "class-validator";

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

export class DeliveryOrder {
   @IsDefined()
   @IsNumber()
   order_id: number;

   @IsDefined()
   delivery_details: DeliveryDetails;

   @IsDefined()
   @IsNumber()
   total_cart_price: number;

   @IsDefined()
   @IsString()
   pay: Pay;
}

export class LastVerifiedOrder {
   created_at: Date;
   id: number;
   status: OrderStatus;
}

export const orders = "orders";
