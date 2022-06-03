import {DatabaseCartProduct, DeliveryDetails} from "../../../../common/types";

export type VerifyOrderDto = {

  verified_fullname: string
  phone_number: string
  delivery_details?: DeliveryDetails
  is_delivered?: boolean
  cart?: DatabaseCartProduct[]

}