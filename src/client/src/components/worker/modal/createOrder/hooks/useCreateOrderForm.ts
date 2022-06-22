import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";
import { useVirtualCart } from "../../../hooks/useVirtualCart";

export interface WorkerCreateOrderFormState {
   verified_fullname_c: FormField;
   phone_number_c: FormField;
   address_c: FormField;
   entrance_number_c: FormField;
   flat_call_c: FormField;
   floor_c: FormField;
   is_delivered_c: {
      value: boolean;
      isValid: boolean;
   };
}

const formDefaults: WorkerCreateOrderFormState = {
   verified_fullname_c: {
      value: "",
      isValid: false
   },
   phone_number_c: {
      value: "",
      isValid: false
   },
   address_c: {
      value: "",
      isValid: false
   },
   entrance_number_c: {
      value: "",
      isValid: false
   },
   flat_call_c: {
      value: "",
      isValid: false
   },
   floor_c: {
      value: "",
      isValid: false
   },
   is_delivered_c: {
      value: false,
      isValid: true
   }
};

export function useCreateOrderForm() {
   const [formValues, setFormValues] = useState<WorkerCreateOrderFormState>(formDefaults);

   const virtualCart = useVirtualCart();

   function setFormDefaults() {
      setFormValues(formDefaults);
      formValues.is_delivered_c.value = false;
      virtualCart.clearVirtualCart();
   }

   const isSubmitButtonActive = useMemo(() => {
      const values = Object.values(formValues);
      const withAddressAndAllValid = values.every((v) => v.isValid);
      const withoutAddressAndRestValid =
         formValues.phone_number_c.isValid && !formValues.is_delivered_c.value && formValues.verified_fullname_c.isValid;
      const formValidity = withAddressAndAllValid || withoutAddressAndRestValid;

      return formValidity;
   }, [formValues]);

   function getFormValues() {
      const result = {
         delivery_details: {
            address: formValues.address_c.value,
            floor: Number(formValues.floor_c.value),
            entrance_number: Number(formValues.entrance_number_c.value),
            flat_call: Number(formValues.flat_call_c.value)
         },
         is_delivered: formValues.is_delivered_c.value,
         phone_number: `+7${formValues.phone_number_c.value}`,
         verified_fullname: formValues.verified_fullname_c.value
      };
      return result;
   }

   return {
      setFormDefaults,
      setFormValues,
      formValues,
      getFormValues,
      isSubmitButtonActive
   };
}
