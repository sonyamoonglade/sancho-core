import { AxiosInstance } from "axios";
import { useCallback } from "react";
import { CreateUserOrderDto } from "../../../common/types";

export function useCreateOrder(client: AxiosInstance) {
   const createUserOrder = useCallback(async function (body: CreateUserOrderDto) {
      await client.post(`order/createUserOrder`, body);
   }, []);

   return { createUserOrder };
}
