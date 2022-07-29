import React, { FC, useEffect } from "react";
import { useAppSelector, windowSelector } from "../../../../../redux";
import { useFormValidations } from "../../../../../hooks/useFormValidations";
import FormInput from "../../../../ui/formInput/FormInput";
import { CompleteOrderFormState } from "../hooks/useCompleteOrderForm";

interface CompleteOrderFormProps {
   formValues: CompleteOrderFormState;
   setFormValues: Function;
   setFormDefaults: Function;
}

const CompleteOrderForm: FC<CompleteOrderFormProps> = ({ formValues, setFormDefaults, setFormValues }) => {
   const { worker } = useAppSelector(windowSelector);
   const { minLengthValidation } = useFormValidations();

   useEffect(() => {
      if (!worker.completeOrder) {
         setFormDefaults();
      }
   }, [worker.completeOrder]);

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

export default React.memo(CompleteOrderForm);
