import { useAxios } from "../../../../../hooks/useAxios";
import { useCallback } from "react";
import { DeliveryDetails } from "../../../../../common/types";
import { Mark } from "../../../../../types/types";

export interface UserCredentials {
   userDeliveryAddress: DeliveryDetails;
   username: string;
   marks: Mark[];
}

export function useCreateMasterOrder() {
   const client = useAxios();

   const createMasterOrder = useCallback(
      async function (body: any) {
         const url = "order/createMasterOrder";
         await client.post(url, body);
      },
      [client]
   );

   return { createMasterOrder };
}
