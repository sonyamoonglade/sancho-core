/*
  This file is required for contract
  between notification service and NestJS core server.
  In this file, payload for each event could be found,
  that's registered in Events enum down below and
  not marked as *InternalEvent.
 */

export enum InternalEvents {
   REFRESH_ORDER_QUEUE = "refresh_order_q" //*InternalEvent
}

export enum Events {
   ORDER_CREATED = "order_created",
   WORKER_LOGIN = "worker_login"
}
