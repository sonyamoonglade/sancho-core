import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { Promotion } from "../common/types";

interface GetPromotionsResponse {
   promotions: Promotion[];
}

export function useUserApi() {
   const client = useAxios();

   const getPromotions = useCallback(
      async function (): Promise<Promotion[]> {
         const endpoint = "/promotion";
         const { data } = await client.get<GetPromotionsResponse>(endpoint);
         return data.promotions;
      },
      [client]
   );

   return { getPromotions };
}
