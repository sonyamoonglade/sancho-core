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
      }
   };

   const [formValues, setFormValues] = useState<UserOrderFormState>(formDefaults);

   function setFormDefaults() {
      setFormValues(formDefaults);
   }

   const isSubmitButtonActive = useMemo(() => {
      const values = Object.values(formValues);
      const withAddressAndAllValid = values.every((v) => v.isValid);
      const withoutAddressAndRestValid = formValues.phone_number.isValid && !formValues.is_delivered.value;
      const formValidity = withAddressAndAllValid || withoutAddressAndRestValid;

      return formValidity;
   }, [formValues]);

   function getFormValues(): UserOrderFormValuesInterface {
      const adjacencyValues = new Map();
      for (const [k, v] of Object.entries(formValues)) {
         adjacencyValues.set(k, v.value);
      }
      let delivery_details: DeliveryDetails = null;
      let finalValues: UserOrderFormValuesInterface;
      if (adjacencyValues.get("is_delivered")) {
         delivery_details = {
            address: adjacencyValues.get("address"),
            entrance_number: Number(adjacencyValues.get("entrance_number")),
            flat_call: Number(adjacencyValues.get("flat_call")),
            floor: Number(adjacencyValues.get("floor"))
         };
         finalValues = {
            is_delivered: adjacencyValues.get("is_delivered"),
            delivery_details,
            phone_number: `+7${adjacencyValues.get("phone_number")}`,
            is_delivered_asap: adjacencyValues.get("is_delivered_asap")
         };
      } else {
         finalValues = {
            is_delivered: adjacencyValues.get("is_delivered"),
            phone_number: `+7${adjacencyValues.get("phone_number")}`,
            is_delivered_asap: adjacencyValues.get("is_delivered_asap")
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