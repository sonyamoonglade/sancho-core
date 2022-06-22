import React, { FC, useEffect } from "react";
import { useAppSelector, windowSelector } from "../../../../../redux";
import { useFormValidations } from "../../../../../hooks/useFormValidations";
import { CancelOrderFormState } from "../hooks/useCancelOrderForm";
import FormInput from "../../../../formInput/FormInput";

interface cancelOrderFormProps {
   formValues: CancelOrderFormState;
   setFormValues: Function;
   setFormDefaults: Function;
   setExplanationPreset: Function;
}

const CancelOrderForm: FC<cancelOrderFormProps> = ({ formValues, setFormDefaults, setFormValues, setExplanationPreset }) => {
   const { worker } = useAppSelector(windowSelector);
   const { minLengthValidation } = useFormValidations();

   useEffect(() => {
      if (!worker.cancelOrder) {
         setFormDefaults();
      } else {
         setExplanationPreset(1);
      }
   }, [worker.cancelOrder]);

   return (
      <>
         <FormInput
            name={"orderId"}
            type={"text"}
            placeholder={"Номер заказа"}
            formValue={formValues["orderId"]}
            setV={setFormValues}
            onBlurValue={"#"}
            maxLength={6}
            minLength={6}
            fieldValidationFn={minLengthValidation}
            Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]")}
         />
      </>
   );
};

export default React.memo(CancelOrderForm);
