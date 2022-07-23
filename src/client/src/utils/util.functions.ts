import { DatabaseCartProduct, OrderQueue, VerifiedQueueOrder, WaitingQueueOrder } from "../common/types";

export const utils = {
   sixifyOrderId: function (orderId: number) {
      let currentId: string[] = orderId.toString().split("");
      for (let i = 0; i < 6; i++) {
         if (currentId.length !== 6) {
            currentId.unshift("0");
         }
      }
      return currentId.join("");
   },
   getOrderTotalPrice: function (vcart: DatabaseCartProduct[]) {
      return vcart.reduce((a, c) => {
         a += c.price * c.quantity;
         return a;
      }, 0);
   },
   findOrderInWaitingQ: function (q: OrderQueue, orderId: number): WaitingQueueOrder {
      return q.waiting.find((o) => {
         return o.id === orderId;
      });
   },

   findOrderInVerifiedQ: function (q: OrderQueue, orderId: number): VerifiedQueueOrder {
      return q.verified.find((o) => {
         return o.id === orderId;
      });
   },

   getOrderTotalPriceByCart: function (cart: DatabaseCartProduct[]) {
      if (!cart) return 0;
      return cart.reduce((a, c) => {
         a += c.price * c.quantity;
         return a;
      }, 0);
   }
};
