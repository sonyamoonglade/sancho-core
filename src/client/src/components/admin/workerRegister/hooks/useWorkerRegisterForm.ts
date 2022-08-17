import { useState } from "react";

export interface WorkerRegisterFormState {
   login: string;
   password: string;
   name: string;
}

export function useWorkerRegisterForm() {
   const [formValues, setFormValues] = useState<WorkerRegisterFormState>(Object.assign({}, null));

   function setFormDefaults() {
      setFormValues((state: WorkerRegisterFormState) => {
         const copy = Object.assign({}, state);
         copy.name = "";
         copy.login = "";
         copy.name = "";
         return { ...copy };
      });
   }
   return { formValues, setFormValues, setFormDefaults };
}
