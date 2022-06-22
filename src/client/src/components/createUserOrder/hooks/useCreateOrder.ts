import { AxiosInstance } from "axios";
import { useCallback } from "react";
import { UserOrderFormValuesInterface } from "../Order";
import { DatabaseCartProduct, DeliveryDetails } from "../../../common/types";

interface CreateOrderDto {
   is_delivered: boolean;
   delivery_details?: DeliveryDetails;
   cart: DatabaseCartProduct[];
   is_delivered_asap: boolean;
}

export function useCreateOrder(client: AxiosInstance) {
   const createUserOrder = useCallback(async function (formValues: UserOrderFormValuesInterface, cart: DatabaseCartProduct[]) {
      const { is_delivered, delivery_details, is_delivered_asap } = formValues;
      const body: CreateOrderDto = {
         is_delivered,
         delivery_details: delivery_details !== undefined ? delivery_details : null,
         cart,
         is_delivered_asap
      };

      await client.post(`order/createUserOrder`, body);
   }, []);

   return { createUserOrder };
}
