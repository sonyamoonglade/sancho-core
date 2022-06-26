import { useCallback } from "react";
import { CompleteOrderFormValues } from "./useCompleteOrderForm";
import { useAxios } from "../../../../../hooks/useAxios";

export function useCompleteOrder() {
   const client = useAxios();

   const completeOrder = useCallback(async function (body: CompleteOrderFormValues) {
      const url = "/order/complete";
      await client.put(url, body);
   }, []);

   return { completeOrder };
}
