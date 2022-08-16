import { useState } from "react";

interface WorkerRegisterFormState {
   login: string;
   password: string;
   role: string;
   name: string;
}

export function useWorkerRegisterForm() {
   const [formValues, setFormValues] = useState<WorkerRegisterFormState>(Object.assign({}, null));

   function setFormDefaults() {
      setFormValues((state: WorkerRegisterFormState) => {
         const copy = Object.assign({}, state);
         copy.name = "";
         copy.login = "";
         copy.role = "";
         copy.name = "";
         return { ...copy };
      });
   }
   return { formValues, setFormValues, setFormDefaults };
}
