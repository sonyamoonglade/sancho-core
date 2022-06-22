import { useAxios } from "../../../../../hooks/useAxios";
import { useCallback } from "react";

export function useCreateMasterOrder() {
   const { client } = useAxios();

   const createMasterOrder = useCallback(
      async function (body: any) {
         await client.post("/order/createMasterOrder", body);
      },
      [client]
   );

   return { createMasterOrder };
}
