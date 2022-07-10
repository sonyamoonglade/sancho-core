import { DatabaseCartProduct, OrderQueue, WaitingQueueOrder } from "../../../../../common/types";
import { AxiosInstance } from "axios";
import { useCallback } from "react";

export function useVerifyOrder(client: AxiosInstance, orderQueue: OrderQueue, totalOrderPrice: number, vcart: DatabaseCartProduct[]) {
   const verifyOrder = useCallback(
      async function (body: any) {
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

   function findWaitingOrderByPhoneNumber(phoneNumber: string): WaitingQueueOrder | undefined {
      const order = orderQueue?.waiting.find((o) => {
         if (o.user.phone_number === `+7${phoneNumber}`) {
            return o;
         }
         return undefined;
      });
      return order;
   }

   return { verifyOrder, findWaitingOrderByPhoneNumber, fetchUsername };
}
