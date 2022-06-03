import {Order} from "../../entities/Order";
import {DatabaseCartProduct, DeliveryDetails} from "../../../../common/types";

export class CreateUserOrderDto implements Partial<Order>{
  cart: DatabaseCartProduct[];
  is_delivered: boolean;
  delivery_details?: DeliveryDetails;
}

export class CreateMasterOrderDto implements Partial<Order>{

  phone_number: string
  cart: DatabaseCartProduct[]
  is_delivered: boolean
  delivery_details?: DeliveryDetails
  verified_fullname: string

}