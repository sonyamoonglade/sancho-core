import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { UserCredentials } from "../components/worker/modal/createOrder/hooks/useCreateMasterOrder";

type DownloadCheckDto = {
   order_id: number;
};

export function useWorkerApi() {
   const client = useAxios();

   const downloadCheck = useCallback(async function (orderId: number) {
      const endPoint = `/delivery/check?v=${orderId}`;
      const resp = await client.get(endPoint, {
         responseType: "blob",
         responseEncoding: "utf-8"
      });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const linkObj: HTMLAnchorElement = document.createElement("a");
      linkObj.style.display = "none";
      linkObj.href = url;
      linkObj.download = `Заказ#${orderId}.docx`;
      linkObj.click();
   }, []);

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

   return { downloadCheck, fetchUserCredentials };
}
