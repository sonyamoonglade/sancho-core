import { DatabaseCartProduct, OrderQueue, VerifiedQueueOrder, WaitingQueueOrder } from "../common/types";

export const helpers = {
   sixifyOrderId: function (orderId: number): string {
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
   findOrderInWaitingQ: function (q: OrderQueue, orderId: number): WaitingQueueOrder | undefined {
      return q.waiting.find((o) => {
         return o.id === orderId;
      });
   },

   findOrderInVerifiedQ: function (q: OrderQueue, orderId: number): VerifiedQueueOrder | undefined {
      return q.verified.find((o) => {
         return o.id === orderId;
      });
   },

   findOrderInWaitingQByPhoneNumber: function (q: OrderQueue, phoneNumber: string): WaitingQueueOrder | undefined {
      return q?.waiting.find((o) => o.user.phone_number === `+7${phoneNumber}`);
   },

   getOrderTotalPriceByCart: function (cart: DatabaseCartProduct[]) {
      if (!cart) return 0;
      return cart.reduce((a, c) => {
         a += c.price * c.quantity;
         return a;
      }, 0);
   },

   utcNow(): Date {
      //utc ISO-String (*Need return type of Date for DTO's. Database accepts strings as date)
      return new Date().toLocaleString("en", {
         timeZone: "UTC"
      }) as unknown as Date;
   }
};
