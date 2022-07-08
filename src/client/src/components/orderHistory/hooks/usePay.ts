import { useAxios } from "../../../hooks/useAxios";
import { useCallback } from "react";

export function usePay() {
   const client = useAxios();

   const pay = useCallback(async function (orderId: number) {
      const r = await client.put(`order/pay?v=${orderId}`);
      if (r.status === 200) {
         return r;
      }
      return null;
   }, []);

   return { pay };
}
