//Deprecated
export function usePaywaySelect(setPayway: Function, setFormValues: Function) {
   function handlePayChange(e: any) {
      // const v = e.target.value;
      // setPayway(v);
      // setFormValues((state: WorkerCreateOrderFormState) => {
      //    const copy = Object.assign({}, state);
      //    copy.pay = {
      //       value: v,
      //       isValid: true
      //    };
      //    return { ...copy };
      // });
   }

   return { handlePayChange };
}
