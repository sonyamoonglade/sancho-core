import { useState } from "react";
import { useWorkerRegisterForm } from "../../workerRegister/hooks/useWorkerRegisterForm";

export interface RunnerRegisterFormState {
   name: string;
   phoneNumber: string;
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
   return { formValues, setFormValues, setFormDefaults };
}
