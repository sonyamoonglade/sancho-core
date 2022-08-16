import { AppRoles, DeliveryDetails } from "../../../common/types";
import { Mark } from "./Mark";

export type User = {
   id?: number;
   phone_number?: string;
   role: AppRoles;
   remembered_delivery_address?: DeliveryDetails;
   login?: string;
   password?: string;
   name?: string;
};

export function CustomerData(u: User): CustomerUser {
   if (!u.remembered_delivery_address) {
      if (u.name) {
         return {
            phone_number: u.phone_number,
            username: u.name
         };
      }
      return {
         phone_number: u.phone_number
      };
   }
   if (u.name) {
      return {
         phone_number: u.phone_number,
         delivery_details: {
            address: u.remembered_delivery_address.address,
            entrance_number: u.remembered_delivery_address.entrance_number,
            flat_call: u.remembered_delivery_address.flat_call,
            floor: u.remembered_delivery_address.floor
         },
         username: u.name
      };
   }
   return {
      username: u.name,
      phone_number: u.phone_number
   };
}
export type CustomerUser = {
   username?: string;
   delivery_details?: DeliveryDetails;
   phone_number: string;
};

export type MasterUser = {
   login: string;
   name: string;
   role: string;
};

export type RunnerUser = {
   name: string;
   phoneNumber: string;
};

export type DeliveryUser = {
   user_id: number;
   username: string;
   phone_number: string;
   marks: Mark[];
};

export type CheckUser = {
   username: string;
   phone_number: string;
};

export const users = "users";
