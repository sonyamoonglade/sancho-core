import { FormField } from "../../../../../types/types";
import { useEffect, useMemo, useState } from "react";
import { helpers } from "../../../../../helpers/helpers";
import { WaitingQueueOrder } from "../../../../../common/types";
import { useAppSelector, workerSelector } from "../../../../../redux";

export interface CancelOrderFormState {
   orderId: FormField;
   cancelExplanation: string;
   cancellable: boolean;
}

const formDefaults: CancelOrderFormState = {
   orderId: {
      value: "",
      isValid: false
   },
   cancelExplanation: "",
   cancellable: false
};

export function useCancelOrderForm() {
   const [formValues, setFormValues] = useState<CancelOrderFormState>(formDefaults);
   const { orderQueue } = useAppSelector(workerSelector);

   useEffect(() => {
      if (formValues.orderId.isValid) {
         const orderId = Number(formValues.orderId.value);
         const o: WaitingQueueOrder = helpers.findOrderInWaitingQ(orderQueue, orderId) || helpers.findOrderInVerifiedQ(orderQueue, orderId);
         if (o) {
            return setCancellable(true);
         }
      }
      return setCancellable(false);
   }, [formValues.orderId.isValid]);
   const cancellable = useMemo(() => {
      return formValues.cancellable;
   }, [formValues.cancellable]);

   function setCancellable(v: boolean): void {
      setFormValues((state: CancelOrderFormState) => {
         return { ...state, cancellable: v };
      });
      return;
   }
   function setSixifiedOrderId(orderId: number) {
      setFormValues((state: CancelOrderFormState) => {
         const copy = Object.assign({}, state);
         const correctIdFormat = helpers.sixifyOrderId(orderId);
         copy.orderId.value = correctIdFormat;
         copy.orderId.isValid = true;
         return { ...copy };
      });
   }

   function setFormDefaults() {
      setFormValues(formDefaults);
      setCancellable(false);
   }
   function getFormValues(): { order_id: number; cancel_explanation: string } {
      return Object.assign({
         order_id: Number(formValues.orderId.value),
         cancel_explanation: formValues.cancelExplanation
      });
   }

   return {
      formValues,
      setFormValues,
      setFormDefaults,
      cancellable,
      getFormValues,
      setCancellable,
      setSixifiedOrderId
   };
}
