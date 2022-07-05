import { DatabaseCartProduct, DeliveryDetails, OrderStatus } from "../../../../client/src/common/types";

export class QueueOrderDto {
   id: number;
   cart: DatabaseCartProduct[];
   created_at: Date;
   status: OrderStatus;
   is_delivered: boolean;
   delivery_details: null | DeliveryDetails;
   total_cart_price: number;
   is_delivered_asap: boolean;
   delivered_at: Date;
   name: string;
   phone_number: string;
}