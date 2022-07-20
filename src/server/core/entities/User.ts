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

export type DeliveryUser = {
   user_id: number;
   username: string;
   phone_number: string;
   marks: Mark[];
};

export const users = "users";
