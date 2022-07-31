import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";
import { useVirtualCart } from "../../../hooks/useVirtualCart";
import { UserCredentials } from "./useCreateMasterOrder";
import { DeliveryDetails, Pay } from "../../../../../common/types";

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
   delivered_at: {
      value: string;
      isValid: boolean;
   };
   is_delivered_asap: {
      value: boolean;
      isValid: boolean;
   };
}

export interface WorkerCreateOrderFormValues {
   is_delivered: boolean;
   phone_number: string;
   username: string;
   is_delivered_asap: boolean;
   delivery_details?: DeliveryDetails;
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
   },
   delivered_at: {
      value: "",
      isValid: false
   },
   is_delivered_asap: {
      value: false,
      isValid: true
   }
};

export function useCreateOrderForm() {
   const [formValues, setFormValues] = useState<WorkerCreateOrderFormState>(formDefaults);

   const virtualCart = useVirtualCart();

   function setFormDefaults() {
      setFormValues((state) => {
         const copy: WorkerCreateOrderFormState = Object.assign({}, state);
         copy.verified_fullname_c = {
            value: "",
            isValid: false
         };
         copy.floor_c = {
            value: "",
            isValid: false
         };
         copy.address_c = {
            value: "",
            isValid: false
         };
         copy.entrance_number_c = {
            value: "",
            isValid: false
         };
         copy.flat_call_c = {
            value: "",
            isValid: false
         };
         copy.phone_number_c = {
            value: "",
            isValid: false
         };

         copy.is_delivered_asap = {
            value: false,
            isValid: true
         };
         copy.is_delivered_c = {
            value: false,
            isValid: true
         };
         copy.delivered_at = {
            value: "",
            isValid: false
         };
         return { ...copy };
      });
      virtualCart.clearVirtualCart();
   }

   function setUserCredentials(creds: UserCredentials): void {
      setFormValues((state: WorkerCreateOrderFormState) => {
         const copy: WorkerCreateOrderFormState = Object.assign({}, state);
         if (creds.userDeliveryAddress !== null) {
            const { address, entrance_number, flat_call, floor } = creds.userDeliveryAddress;
            copy.floor_c.value = floor.toString();
            copy.floor_c.isValid = true;
            copy.address_c.value = address.toString();
            copy.address_c.isValid = true;
            copy.entrance_number_c.value = entrance_number.toString();
            copy.entrance_number_c.isValid = true;
            copy.flat_call_c.value = flat_call.toString();
            copy.flat_call_c.isValid = true;
         }
         if (creds.username !== null) {
            copy.verified_fullname_c.value = creds.username;
            copy.verified_fullname_c.isValid = true;
         }

         return { ...copy };
      });
   }

   const isSubmitButtonActive = useMemo(() => {
      const values = Object.values(formValues);
      const withAddressAndAllValid = values.every((v) => v.isValid);
      const withoutAddressAndRestValid =
         formValues.phone_number_c.isValid && !formValues.is_delivered_c.value && formValues.verified_fullname_c.isValid;
      const formValidity = withAddressAndAllValid || withoutAddressAndRestValid;
      return formValidity;
   }, [formValues]);

   function getFormValues(): WorkerCreateOrderFormValues {
      const result: WorkerCreateOrderFormValues = {
         is_delivered: formValues.is_delivered_c.value,
         phone_number: `+7${formValues.phone_number_c.value}`,
         username: formValues.verified_fullname_c.value,
         is_delivered_asap: formValues.is_delivered_asap.value,
         delivery_details: null
      };
      if (formValues.is_delivered_c.value) {
         result.delivery_details = {
            delivered_at: new Date(formValues.delivered_at.value),
            address: formValues.address_c.value,
            floor: Number(formValues.floor_c.value),
            entrance_number: Number(formValues.entrance_number_c.value),
            flat_call: Number(formValues.flat_call_c.value)
         };
      }
      return result;
   }

   function clearDeliveryDetails() {
      setFormValues((state: WorkerCreateOrderFormState) => {
         const copy = Object.assign({}, state);
         copy.floor_c = {
            value: "",
            isValid: false
         };
         copy.address_c = {
            value: "",
            isValid: false
         };
         copy.entrance_number_c = {
            value: "",
            isValid: false
         };
         copy.flat_call_c = {
            value: "",
            isValid: false
         };
         return { ...copy };
      });
   }

   return {
      setFormDefaults,
      setFormValues,
      formValues,
      getFormValues,
      isSubmitButtonActive,
      setUserCredentials,
      clearDeliveryDetails
   };
}
