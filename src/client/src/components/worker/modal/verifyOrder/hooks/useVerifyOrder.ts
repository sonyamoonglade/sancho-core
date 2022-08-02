import { DatabaseCartProduct, OrderQueue, WaitingQueueOrder } from "../../../../../common/types";
import { AxiosInstance } from "axios";
import { useCallback } from "react";
import { WorkerVerifyOrderFormValues } from "./useVerifyOrderForm";

export function useVerifyOrder(client: AxiosInstance, orderQueue: OrderQueue, totalOrderPrice: number, vcart: DatabaseCartProduct[]) {
   const verifyOrder = useCallback(
      async function (body: WorkerVerifyOrderFormValues) {
         await client.put("order/verify", body);
      },
      [vcart, totalOrderPrice, orderQueue]
   );

   const fetchUsername = useCallback(async function (phoneNumber: string) {
      const res = await client.get(`/users/username?phoneNumber=7${phoneNumber}`);
      if (res.status === 200) {
         return res.data.username;
      }
      return "";
   }, []);

   return { verifyOrder, fetchUsername };
}
