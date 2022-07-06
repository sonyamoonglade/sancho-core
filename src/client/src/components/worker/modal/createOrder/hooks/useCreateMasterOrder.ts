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

   const fetchUserCredentials = useCallback(async function (phoneNumber: string): Promise<UserCredentials | null> {
      try {
         const res = await client.get(`users/credentials?phoneNumber=7${phoneNumber}`);
         if (res.status === 200) {
            return res.data.credentials;
         }
         return null;
      } catch (e) {
         return null;
      }
   }, []);

   return { createMasterOrder, fetchUserCredentials };
}
