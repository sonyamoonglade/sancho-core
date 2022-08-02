import { useAppCookies } from "./useAppCookies";
import { DeliveryDetails } from "../common/types";
import { useMemo } from "react";
import { useAppSelector, userSelector } from "../redux";

export function useUser() {
   const { deliveryDetails, phoneNumber } = useAppCookies();
   const { isAuthenticated } = useAppSelector(userSelector);
   const delivery_details: DeliveryDetails | null = useMemo(() => {
      // If cookie is defined parse it as delivery_details
      if (deliveryDetails?.value !== undefined) {
         return deliveryDetails.value;
      }
      return null;
   }, [deliveryDetails, isAuthenticated]);

   const phone_number: string = useMemo(() => {
      // Same as delivery details
      if (phoneNumber?.value && phoneNumber?.value?.trim().length !== 0) {
         return phoneNumber.value;
      }
      return "";
   }, [phoneNumber, isAuthenticated]);

   return { delivery_details, phone_number };
}
