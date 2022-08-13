import { DatabaseCartProduct, OrderQueue, VerifiedQueueOrder, WaitingQueueOrder } from "../common/types";
import dayjs from "dayjs";
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

   getYearTtl(): Date {
      const now = dayjs.tz(dayjs(), "UTC");
      return now.add(1, "year").toDate();
   }
};
