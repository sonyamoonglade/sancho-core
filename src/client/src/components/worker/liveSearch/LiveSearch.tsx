import React, { FC, useEffect, useState } from "react";

import "./live-search.styles.scss";
import FormInput from "../../formInput/FormInput";
import { FormField } from "../../../types/types";
import { useFormValidations } from "../../../hooks/useFormValidations";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAxios } from "../../../hooks/useAxios";
import { useAppDispatch, useAppSelector, windowSelector, workerActions } from "../../../redux";
import { fetchQueryLiveSearchResults } from "../../../redux/worker/worker.async-actions";

interface liveSearchFormState {
   livesearch: FormField;
}

interface liveSearchProps {
   extraClassName?: string;
   focusRef: any;
}
const LiveSearch: FC<liveSearchProps> = ({ extraClassName, focusRef }) => {
   const [formValues, setFormValues] = useState<liveSearchFormState>({
      livesearch: {
         value: "",
         isValid: false
      }
   });
   const client = useAxios();
   const dispatch = useAppDispatch();
   const { minLengthValidation } = useFormValidations();

   const query = useDebounce(300, formValues.livesearch.value);

   const { worker } = useAppSelector(windowSelector);

   useEffect(() => {
      if (query.trim().length === 0) {
         dispatch(workerActions.overrideQueryResults([]));
      } else dispatch(fetchQueryLiveSearchResults(query, client));
   }, [query]);
   useEffect(() => {
      if (!worker.virtualCart) {
         setFormDefaults();
      }
   }, [worker.virtualCart]);

   function setFormDefaults() {
      setFormValues({
         livesearch: {
            value: "",
            isValid: false
         }
      });
   }

   return (
      <div className={`live_search ${extraClassName || null}`}>
         <FormInput
            name={"livesearch"}
            type={"text"}
            placeholder={"Название продукта... "}
            fieldValidationFn={minLengthValidation}
            minLength={2}
            extraClassName={"ls_input"}
            onBlurValue={""}
            formValue={formValues.livesearch}
            setV={setFormValues}
            isActiveForValidation={true}
            focusRef={focusRef}
            Regexp={new RegExp("!?[0-9]+|!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
         />

         <button className="live_search_button">Найти</button>
      </div>
   );
};

export default LiveSearch;
