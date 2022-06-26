import { useAxios } from "../../../../../hooks/useAxios";
import { useCallback } from "react";

export function useCreateMasterOrder() {
   const client = useAxios();

   const createMasterOrder = useCallback(
      async function (body: any) {
         const url = "/order/createMasterOrder";
         await client.post(url, body);
      },
      [client]
   );

   return { createMasterOrder };
}
