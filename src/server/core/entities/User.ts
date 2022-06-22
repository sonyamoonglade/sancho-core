import { AppRoles, DeliveryDetails } from "../../../common/types";

export type User = {
   id?: number;
   phone_number?: string;
   role: AppRoles;
   remembered_delivery_address?: DeliveryDetails;
   login?: string;
   password?: string;
};

export const users = "users";
