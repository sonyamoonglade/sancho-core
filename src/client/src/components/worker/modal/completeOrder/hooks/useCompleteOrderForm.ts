import { FormField } from "../../../../../types/types";
import { useEffect, useMemo, useState } from "react";
import { utils } from "../../../../../utils/util.functions";
import { WaitingQueueOrder } from "../../../../../common/types";
import { useAppSelector, workerSelector } from "../../../../../redux";

export interface CompleteOrderFormState {
   orderId: FormField;
   completable: boolean;
}

const formDefaults: CompleteOrderFormState = {
   orderId: {
      value: "",
      isValid: false
   },
   completable: false
};

export interface CompleteOrderFormValues {
   order_id: number;
}

export function useCompleteOrderForm() {
   const [formValues, setFormValues] = useState<CompleteOrderFormState>(formDefaults);
   const { orderQueue } = useAppSelector(workerSelector);

   useEffect(() => {
      if (formValues.orderId.isValid) {
         const orderId = Number(formValues.orderId.value);
         const o: WaitingQueueOrder = utils.findOrderInVerifiedQ(orderQueue, orderId);
         if (o) {
            return setCompletable(true);
         }
      }
      return setCompletable(false);
   }, [formValues.orderId.isValid]);
   const completable = useMemo(() => {
      return formValues.completable;
   }, [formValues.completable]);

   function setCompletable(v: boolean): void {
      setFormValues((state: CompleteOrderFormState) => {
         return { ...state, completable: v };
      });
      return;
   }
   function setCorrectOrderId(orderId: number): void {
      setFormValues((state: CompleteOrderFormState) => {
         const obj = state.orderId;
         const correctIdFormat = utils.sixifyOrderId(orderId);
         obj.value = correctIdFormat;
         obj.isValid = true;
         return { ...state, orderId: obj };
      });
   }
   function setFormDefaults() {
      setFormValues(formDefaults);
      setCompletable(false);
   }
   function getFormValues(): CompleteOrderFormValues {
      return Object.assign({
         order_id: Number(formValues.orderId.value)
      });
   }

   return {
      formValues,
      setFormValues,
      setFormDefaults,
      getFormValues,
      setCompletable,
      completable,
      setCorrectOrderId
   };
}
