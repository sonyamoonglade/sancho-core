import { useState } from "react";
import { useWorkerRegisterForm } from "../../workerRegister/hooks/useWorkerRegisterForm";

export interface RunnerRegisterFormState {
   name: string;
   phoneNumber: string;
}

export interface RunnerRegisterFormValues {
   username: string;
   phone_number: string;
}

export function useRunnerRegisterForm() {
   const [formValues, setFormValues] = useState<RunnerRegisterFormState>(Object.assign({}, null));

   function setFormDefaults() {
      setFormValues((state: RunnerRegisterFormState) => {
         const copy = Object.assign({}, state);
         copy.name = "";
         copy.phoneNumber = "" + "";
         return { ...copy };
      });
   }

   function getFormValues(): RunnerRegisterFormValues {
      return {
         username: formValues.name,
         phone_number: formValues.phoneNumber
      };
   }

   return { formValues, setFormValues, setFormDefaults, getFormValues };
}
