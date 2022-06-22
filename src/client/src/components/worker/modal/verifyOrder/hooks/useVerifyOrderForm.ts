import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";
import { OrderQueue } from "../../../../../common/types";

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

   //apply types
   function getFormValues() {
      return {
         phone_number: `+7${formValues.phone_number_w.value}`,
         is_delivered: formValues.is_delivered_w.value,
         verified_fullname: formValues.verified_fullname_w.value,
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

   function setFormDefaults() {
      setFormValues(formDefaults);
      formValues.is_delivered_w.value = false;
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

   function presetDeliveryDetails() {
      if (orderQueue.waiting.length === 0) {
         return;
      }
      const phoneNumber = formValues.phone_number_w.value;
      const order = orderQueue.waiting.find((o) => o.phone_number === `+7${phoneNumber}`);
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
      formDefaults,
      setFormValues,
      isSubmitButtonActive,
      setFormDefaultsExceptPhoneNumberAndFullname
   };
}
