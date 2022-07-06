import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";
import { OrderQueue, VerifiedQueueOrder, WaitingQueueOrder } from "../../../../../common/types";
import { useFormValidations } from "../../../../../hooks/useFormValidations";

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
         phone_number: `+7${formValues.phone_number_w.value}`,
         is_delivered: formValues.is_delivered_w.value,
         username: formValues.verified_fullname_w.value,
         delivery_details: {
            address: formValues.address_w.value,
            flat_call: Number(formValues.flat_call_w.value),
            entrance_number: Number(formValues.entrance_number_w.value),
            floor: Number(formValues.floor_w.value)
         },
         delivered_at: new Date(formValues.delivered_at.value),
         is_delivered_asap: formValues.is_delivered_asap.value
      };
   }

   function setUsername(username: string): void {
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const vf = state.verified_fullname_w;
         vf.value = username;
         vf.isValid = true;
         return { ...state, verified_fullname_w: vf };
      });
   }

   function setFormDefaults() {
      setFormValues(formDefaults);
      formValues.is_delivered_w.value = false;
      setFormValues((state: WorkerVerifyOrderFormState) => {
         const obj = state.phone_number_w;
         obj.value = "";
         obj.isValid = false;
         return { ...state, phone_number_w: obj };
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
      if (orderQueue.waiting.length === 0) {
         return;
      }
      if (order?.is_delivered) {
         const { address, flat_call, entrance_number, floor } = order?.delivery_details;
         const { is_delivered_asap } = order;
         setFormValues((formState: WorkerVerifyOrderFormState) => {
            return {
               ...formState,
               address_w: {
                  value: address,
                  isValid: true
               },
               floor_w: {
                  value: floor.toString(),
                  isValid: true
               },
               entrance_number_w: {
                  value: entrance_number.toString(),
                  isValid: true
               },
               flat_call_w: {
                  value: flat_call.toString(),
                  isValid: true
               },
               is_delivered_w: {
                  value: true,
                  isValid: true
               },
               is_delivered_asap: {
                  value: is_delivered_asap,
                  isValid: true
               }
            };
         });
         return;
      }

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
      setUsername
   };
}
