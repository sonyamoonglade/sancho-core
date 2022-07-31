import { useAppCookies } from "./useAppCookies";
import { DeliveryDetails } from "../common/types";
import { useMemo } from "react";

export function useUser() {
   const { deliveryDetails, phoneNumber } = useAppCookies();

   const delivery_details: DeliveryDetails | null = useMemo(() => {
      // If cookie is defined parse it as delivery_details
      if (deliveryDetails?.value && deliveryDetails?.value?.trim().length !== 0) {
         return JSON.parse(deliveryDetails.value) as unknown as DeliveryDetails;
      }
      return null;
   }, [deliveryDetails]);

   const phone_number: string = useMemo(() => {
      // Same as delivery details
      if (phoneNumber?.value && phoneNumber?.value?.trim().length !== 0) {
         return phoneNumber.value;
      }
      return "";
   }, [phoneNumber]);

   return { delivery_details, phone_number };
}
