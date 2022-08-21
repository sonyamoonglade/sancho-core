/*
  This file is required for contract
  between notification service and NestJS core server.
  In this file, payload for each event could be found,
  that's registered in Events enum down below and
  not marked as *InternalEvent.
 */

export type ExternalCaller = (body: any) => Promise<void>;

export enum InternalEvents {
   REFRESH_ORDER_QUEUE = "refresh_order_q" //*InternalEvent
}

export enum Events {
   MASTER_ORDER_CREATE = "master_order_create",
   USER_ORDER_CREATE = "user_order_create",
   WORKER_LOGIN = "worker_login"
}

//Payload for Events.MASTER_ORDER_CREATE
export interface MasterOrderCreatePayload {
   order_id: number;
   username: string;
   total_cart_price: number;
   phone_number: string;
}
//Payload for Events.USER_ORDER_CREATE
export interface UserOrderCreatePayload {
   order_id: number;
   total_cart_price: number;
}

//Payload for Events.WORKER_LOGIN
export interface WorkerLoginPayload {
   login_at: Date;
   username: string;
   time_offset: number;
}
