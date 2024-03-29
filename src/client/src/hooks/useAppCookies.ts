import { AppCookies } from "../types/types";
import { useCookies } from "react-cookie";
import { CookieOptions } from "express";
import { helpers } from "../helpers/helpers";

export function useAppCookies(): AppCookies {
   //Cookie is omitted (e.g. phoneNumberCookie)
   const [phwrap, setPhoneNumber] = useCookies(["phoneNumber"]);
   const [ddwrap, setDeliveryDetails] = useCookies(["deliveryDetails"]);
   const baseOptions: CookieOptions = {
      sameSite: "lax",
      secure: true,
      expires: helpers.getYearTtl()
   };
   function wrapper(name: string, value: string, f: (name: any, value: string, options: CookieOptions) => void) {
      return f(name, value, baseOptions);
   }

   return {
      phoneNumber: {
         value: phwrap.phoneNumber as string,
         set: (value: string) => wrapper("phoneNumber", value, setPhoneNumber)
      },
      deliveryDetails: {
         value: ddwrap.deliveryDetails as string,
         set: (value: string) => wrapper("deliveryDetails", value, setDeliveryDetails)
      }
   };
}
