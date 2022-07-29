import { useState } from "react";
import * as types from "../../../common/types";
import { FormField } from "../../../types/types";

interface PayFormState {
   promo: FormField;
   email: FormField;
   username: FormField;
}

const defaultValues: PayFormState = {
   promo: {
      value: "",
      isValid: false
   },
   email: {
      value: "",
      isValid: false
   },
   username: {
      value: "",
      isValid: false
   }
};

interface PayFormValues {
   promo: string;
   email: string;
   username: string;
}
export function usePayForm() {
   const [payWay, setPayWay] = useState<types.Pay>("online");
   const [formValues, setFormValues] = useState<PayFormState>(defaultValues);

   function handlePaywaySwitch(option: types.Pay) {
      if (option === "onPickup") {
         clearEmailAndUsername();
      }
      if (option !== payWay) {
         setPayWay(option);
      }
   }

   function clearEmailAndUsername() {
      setFormValues((state: PayFormState) => {
         const copy = Object.assign({}, state);
         copy.username = {
            isValid: false,
            value: ""
         };
         copy.email = {
            isValid: false,
            value: ""
         };
         return { ...copy };
      });
   }

   function setFormDefaults(): void {
      setPayWay("online");
      setFormValues((state: PayFormState) => {
         const copy = Object.assign({}, state);
         copy.promo = {
            value: "",
            isValid: false
         };
         copy.username = {
            value: "",
            isValid: false
         };
         copy.email = {
            value: "",
            isValid: false
         };
         return { ...copy };
      });
   }
   function getFormValues(): PayFormValues {
      return {
         promo: formValues.promo.value,
         username: formValues.username.value,
         email: formValues.email.value
      };
   }

   return { payWay, setPayWay, formValues, setFormValues, handlePaywaySwitch, getFormValues, setFormDefaults };
}
