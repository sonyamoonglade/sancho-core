import { useMemo, useState } from "react";
import { UserOrderFormState, UserOrderFormValuesInterface } from "../Order";
import { DeliveryDetails } from "../../../common/types";

export function useUserOrderForm() {
   const formDefaults: UserOrderFormState = {
      address: {
         value: "",
         isValid: false
      },
      entrance_number: {
         value: "",
         isValid: false
      },
      flat_call: {
         value: "",
         isValid: false
      },
      floor: {
         value: "",
         isValid: false
      },
      is_delivered: {
         value: false,
         isValid: true
      },
      phone_number: {
         value: "",
         isValid: false
      },
      is_delivered_asap: {
         value: false,
         isValid: true
      },
      comment: {
         value: "",
         isValid: false
      }
   };

   const [formValues, setFormValues] = useState<UserOrderFormState>(formDefaults);

   function setFormDefaults() {
      setFormValues(formDefaults);
   }

   const isSubmitButtonActive = useMemo(() => {
      let withAddressAndAllValid: boolean = true;
      //Iterate through all entries of formValues
      for (const [k, v] of Object.entries(formValues)) {
         //Ignore comment on first validity check(comment field is optional*)
         if (!v.isValid && k !== "comment") {
            withAddressAndAllValid = false;
         }
         //If eventually meet comment field we have two options ( prev fields must be all valid!, second condition )
         else if (k === "comment" && withAddressAndAllValid) {
            //Whether that's not empty AND not valid -> Can't submit, or else -> Free to go
            if (v.value !== "" && !v.isValid) {
               withAddressAndAllValid = false;
            } else {
               withAddressAndAllValid = true;
            }
         }
      }
      const withoutAddressAndRestValid = formValues.phone_number.isValid && !formValues.is_delivered.value;
      const formValidity = withAddressAndAllValid || withoutAddressAndRestValid;

      return formValidity;
   }, [formValues]);

   function getFormValues(): UserOrderFormValuesInterface {
      let finalValues: UserOrderFormValuesInterface;
      const { is_delivered_asap, is_delivered, address, entrance_number, flat_call, phone_number, comment, floor } = formValues;

      finalValues = {
         is_delivered: is_delivered.value,
         phone_number: `+7${phone_number.value}`,
         is_delivered_asap: is_delivered_asap.value,
         delivery_details: null
      };

      if (is_delivered.value) {
         finalValues.delivery_details = {
            address: address.value,
            entrance_number: Number(entrance_number.value),
            delivered_at: null,
            flat_call: Number(flat_call.value),
            floor: Number(floor.value),
            comment: comment.value
         };
      }

      return finalValues;
   }

   return {
      setFormDefaults,
      isSubmitButtonActive,
      formValues,
      setFormValues,
      getFormValues
   };
}
