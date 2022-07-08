import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";
import { OrderQueue, WaitingQueueOrder } from "../../../../../common/types";
import { useFormValidations } from "../../../../../hooks/useFormValidations";
import { UserCredentials } from "../../createOrder/hooks/useCreateMasterOrder";
import { WorkerCreateOrderFormState } from "../../createOrder/hooks/useCreateOrderForm";

export interface WorkerVerifyOrderFormState {
   verified_fullname_w: FormField;
   phone_number_w: FormField;
   address_w: FormField;
   entrance_number_w: FormField;
   flat_call_w: FormField;
   floor_w: FormField;
   is_delivered_w: {
      value: boolean;
      isValid: boolean;
   };
   delivered_at: {
      value: "";
      isValid: boolean;
   };
   is_delivered_asap: {
      value: boolean;
      isValid: boolean;
   };
}
const formDefaults: WorkerVerifyOrderFormState = {
   verified_fullname_w: {
      value: "",
      isValid: false
   },
   phone_number_w: {
      value: "",
      isValid: false
   },
   address_w: {
      value: "",
      isValid: false
   },
   entrance_number_w: {
      value: "",
      isValid: false
   },
   flat_call_w: {
      value: "",
      isValid: false
   },
   floor_w: {
      value: "",
      isValid: false
   },
   is_delivered_w: {
      value: false,
      isValid: true
   },
   is_delivered_asap: {
      value: false,
      isValid: true
   },
   delivered_at: {
      value: "",
      isValid: false
   }
};

export function useVerifyOrderForm(orderQueue: OrderQueue) {
   const [formValues, setFormValues] = useState<WorkerVerifyOrderFormState>(formDefaults);
   const { minLengthValidation } = useFormValidations();
   //apply types
   function getFormValues() {
      return {
         phoneNumber: `+7${formValues.phone_number_w.value}`,
         isDelivered: formValues.is_delivered_w.value,
         username: formValues.verified_fullname_w.value,
         deliveryDetails: {
            address: formValues.address_w.value,
            flat_call: Number(formValues.flat_call_w.value),
            entrance_number: Number(formValues.entrance_number_w.value),
            floor: Number(formValues.floor_w.value)
         },
         deliveredAt: new Date(formValues.delivered_at.value),
         isDeliveredAsap: formValues.is_delivered_asap.value
      };
   }

   function setCredentials(creds: UserCredentials): void {
      //todo: marks
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const copy = Object.assign({}, state);
         if (creds.username !== null) {
            copy.verified_fullname_w.value = creds.username;
            copy.verified_fullname_w.isValid = true;
         }
         return { ...copy };
      });
   }

   function setCredentialsHard(creds: UserCredentials) {
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const copy: WorkerVerifyOrderFormState = Object.assign({}, state);
         if (creds.userDeliveryAddress !== null) {
            const { address, entrance_number, flat_call, floor } = creds.userDeliveryAddress;
            copy.floor_w.value = floor.toString();
            copy.floor_w.isValid = true;
            copy.address_w.value = address.toString();
            copy.address_w.isValid = true;
            copy.entrance_number_w.value = entrance_number.toString();
            copy.entrance_number_w.isValid = true;
            copy.flat_call_w.value = flat_call.toString();
            copy.flat_call_w.isValid = true;
         }
         if (creds.username !== null) {
            copy.verified_fullname_w.value = creds.username;
            copy.verified_fullname_w.isValid = true;
         }
         return { ...copy };
      });
   }

   function setFormDefaults() {
      setFormValues((state) => {
         const copy: WorkerVerifyOrderFormState = Object.assign({}, state);
         copy.verified_fullname_w = {
            value: "",
            isValid: false
         };
         copy.floor_w = {
            value: "",
            isValid: false
         };
         copy.address_w = {
            value: "",
            isValid: false
         };
         copy.entrance_number_w = {
            value: "",
            isValid: false
         };
         copy.phone_number_w = {
            value: "",
            isValid: false
         };
         copy.flat_call_w = {
            value: "",
            isValid: false
         };
         copy.is_delivered_asap = {
            value: false,
            isValid: true
         };
         copy.is_delivered_w = {
            value: false,
            isValid: true
         };
         copy.delivered_at = {
            value: "",
            isValid: false
         };
         return { ...copy };
      });
   }

   function setFormDefaultsExceptPhoneNumberAndFullname() {
      setFormValues((state: WorkerVerifyOrderFormState) => {
         return {
            ...state,
            is_delivered_w: {
               value: false,
               isValid: true
            },
            address_w: {
               value: "",
               isValid: false
            },
            entrance_number_w: {
               value: "",
               isValid: false
            },
            flat_call_w: {
               value: "",
               isValid: false
            },
            floor_w: {
               value: "",
               isValid: false
            }
         };
      });
   }

   function setPhoneNumber(phoneNumber: string): void {
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const obj = state.phone_number_w;
         obj.value = phoneNumber;
         obj.isValid = minLengthValidation(phoneNumber, 10);
         return { ...state, phone_number_w: obj };
      });
   }

   function presetDeliveryDetails(order: WaitingQueueOrder) {
      if (!order) {
         return;
      }

      const { address, flat_call, entrance_number, floor } = order?.delivery_details;
      const { is_delivered_asap } = order;
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const copy = Object.assign({}, state);
         copy.floor_w = {
            value: floor.toString(),
            isValid: true
         };
         copy.is_delivered_w = {
            value: true,
            isValid: true
         };
         copy.entrance_number_w = {
            value: entrance_number.toString(),
            isValid: true
         };
         copy.address_w = {
            value: address.toString(),
            isValid: true
         };
         copy.flat_call_w = {
            value: flat_call.toString(),
            isValid: true
         };
         copy.is_delivered_asap = {
            value: is_delivered_asap,
            isValid: true
         };
         return { ...copy };
      });

      return;
   }

   const isSubmitButtonActive = useMemo(() => {
      const values = Object.values(formValues);
      const withAddressAndAllValid = values.every((v) => v.isValid);
      const withoutAddressAndRestValid =
         formValues.phone_number_w.isValid && !formValues.is_delivered_w.value && formValues.verified_fullname_w.isValid;
      const formValidity = withAddressAndAllValid || withoutAddressAndRestValid;

      return formValidity;
   }, [formValues]);

   return {
      getFormValues,
      setFormDefaults,
      presetDeliveryDetails,
      formValues,
      setPhoneNumber,
      formDefaults,
      setFormValues,
      isSubmitButtonActive,
      setFormDefaultsExceptPhoneNumberAndFullname,
      setCredentials,
      setCredentialsHard
   };
}
