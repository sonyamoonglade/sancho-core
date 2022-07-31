import { Pay, PayMethods } from "../../../common/types";
import { OrderType } from "../../types/types";

export class PayPolicyException extends Error {
   constructor() {
      super("Pay policy is invalid");
   }
}

export function applyPayPolicy(pay: Pay, isDelivered: boolean, type: OrderType): void {
   //If was not passed for worker orders - ok (see order.controller.createMasterOrder)
   if (pay === undefined && type === "worker") {
      return;
   }

   if (PayMethods.includes(pay) === false) {
      throw new PayPolicyException();
   }

   //If Order is created by worker 'master' then pay could NOT be onPickup
   if (type === "worker" && pay !== "onPickup") {
      throw new PayPolicyException();
   }

   //The rest of the cases is valid policy
   return;
}
