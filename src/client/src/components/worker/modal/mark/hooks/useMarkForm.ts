import { useMemo, useState } from "react";
import { FormField } from "../../../../../types/types";

export interface MarkFormState {
   phoneNumber: FormField;
   content: FormField;
   isImportant: {
      value: boolean;
      isValid: boolean;
   };
}

const formDefaults: MarkFormState = {
   phoneNumber: {
      value: "",
      isValid: false
   },
   content: {
      value: "",
      isValid: false
   },
   isImportant: {
      value: false,
      isValid: true
   }
};

export interface MarkFormValues {
   phoneNumber: string;
   content: string;
   isImportant: boolean;
}

export function useMarkForm() {
   const [formValues, setFormValues] = useState<MarkFormState>(Object.assign({}, formDefaults));

   function setFormDefaults(): void {
      setFormValues((state: MarkFormState) => {
         const copy = Object.assign({}, state);
         copy.phoneNumber = {
            value: "",
            isValid: false
         };
         copy.content = {
            value: "",
            isValid: false
         };
         copy.isImportant = {
            value: false,
            isValid: true
         };
         return { ...copy };
      });
   }
   function setPhoneNumber(phoneNumber: string): void {
      setFormValues((state: MarkFormState) => {
         const copy = Object.assign({}, state);
         copy.phoneNumber = {
            value: phoneNumber,
            isValid: true
         };
         return { ...copy };
      });
   }
   function setIsImportant(v: boolean): void {
      setFormValues((state: MarkFormState) => {
         const copy = Object.assign({}, state);
         copy.isImportant = {
            value: v,
            isValid: true
         };
         return { ...copy };
      });
   }
   function getFormValues(): MarkFormValues {
      return {
         phoneNumber: `+7${formValues.phoneNumber.value}`,
         isImportant: formValues.isImportant.value,
         content: formValues.content.value
      };
   }

   const isSubmitButtonActive = useMemo(() => {
      return formValues.content.isValid && formValues.phoneNumber.isValid;
   }, [formValues]);

   return { setFormDefaults, formValues, setPhoneNumber, setFormValues, setIsImportant, getFormValues, isSubmitButtonActive };
}
