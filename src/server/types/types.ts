import { Request } from "express";

export enum CookieNames {
   SID = "SID",
   cancelBan = "cancel_ban"
}

export interface extendedRequest extends Request {
   user_id: number;
}

export type Miscellaneous = {
   id: number;
   delivery_punishment_value: number;
   delivery_punishment_threshold: number;
   order_creation_delay: number;
};
