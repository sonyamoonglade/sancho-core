import { AxiosInstance } from "axios";
import { useCallback } from "react";
import { CreateUserOrderDto } from "../../../common/types";

export interface CreateUserOrderResponse {
   redirect_url: string;
}

export function useCreateOrder(client: AxiosInstance) {
   const createUserOrder = useCallback(async function (body: CreateUserOrderDto): Promise<CreateUserOrderResponse> {
      const { data } = await client.post<CreateUserOrderResponse>(`order/createUserOrder`, body);
      return data;
   }, []);

   return { createUserOrder };
}
