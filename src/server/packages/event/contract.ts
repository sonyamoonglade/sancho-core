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
   ORDER_CREATED = "order_created",
   WORKER_LOGIN = "worker_login"
}

export interface OrderCreatedPayload {
   order_id: number;
   username: string;
   total_cart_price: number;
   phone_number: string;
}

export interface WorkerLoginPayload {
   login_at: Date;
   username: string;
   time_offset: number;
}
