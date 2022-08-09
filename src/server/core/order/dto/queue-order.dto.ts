import { DatabaseCartProduct, DeliveryDetails, OrderStatus } from "../../../../common/types";

export class QueueOrderRO {
   id: number;
   cart: DatabaseCartProduct[];
   created_at: Date;
   status: OrderStatus;
   is_delivered: boolean;
   delivery_details: null | DeliveryDetails;
   total_cart_price: number;
   is_delivered_asap: boolean;
   name: string;
   phone_number: string;
}
