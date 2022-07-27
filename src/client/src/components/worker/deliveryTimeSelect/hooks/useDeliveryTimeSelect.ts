import { useFormValidations } from "../../../../hooks/useFormValidations";

export function useDeliveryTimeSelect(setSelectV: Function, setFormValues: Function, opt1: string, opt2: string) {
   const { minLengthValidation } = useFormValidations();

   function handleSelectChange(event: any) {
      const v = event.target.value;
      switch (true) {
         case v === opt1:
            setSelectV(opt1);
            setFormValues((state: any) => {
               const obj = state.is_delivered_asap;
               obj.value = false;
               return { ...state, is_delivered_asap: obj };
            });
            setFormValues((state: any) => {
               const obj = state.delivered_at;
               obj.value = "";
               obj.isValid = false;
               return { ...state, delivered_at: obj };
            });
            break;
         case v === opt2:
            setSelectV(opt2);
            setFormValues((state: any) => {
               const obj = state.is_delivered_asap;
               obj.value = true;
               return { ...state, is_delivered_asap: obj };
            });
            setFormValues((state: any) => {
               const obj = state.delivered_at;
               obj.value = "";
               obj.isValid = true;
               return { ...state, delivered_at: obj };
            });
            break;
      }
   }
   function handleTimeChange(event: any) {
      const v = event.target.value;
      setFormValues((state: any) => {
         const obj = state.delivered_at;
         obj.value = v;
         return { ...state, delivered_at: obj };
      });
      if (minLengthValidation(v, 16)) {
         setFormValues((state: any) => {
            const obj = state.delivered_at;
            obj.isValid = true;
            return { ...state, delivered_at: obj };
         });
      }
   }

   return { handleSelectChange, handleTimeChange };
}
