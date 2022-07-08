import { useCallback } from "react";
import { useAxios } from "../../../../../hooks/useAxios";
import { MarkFormValues } from "./useMarkForm";

export function useMark() {
   const client = useAxios();

   const createMark = useCallback(async function (body: MarkFormValues) {
      const r = await client.post("users/mark", body);
      if (r.status === 201) {
         return true;
      }
      return false;
   }, []);

   return { createMark };
}
