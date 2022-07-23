import { useCallback } from "react";
import { AxiosInstance } from "axios";
import { useAxios } from "./useAxios";

type NotifyRunnerDto = {
   order_id: number;
};

export function useNotifyRunner() {
   const client = useAxios();

   const notify = useCallback(async function (orderId: number): Promise<boolean> {
      const body: NotifyRunnerDto = {
         order_id: orderId
      };
      const endPoint = "/delivery";
      const res = await client.post(endPoint, body);
      if (res.status === 201) {
         return true;
      }
      return false;
   }, []);
   return { notify };
}
