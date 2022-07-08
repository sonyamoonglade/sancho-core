import React, { FC, useEffect, useMemo, useState } from "react";

import "./live-search.styles.scss";
import FormInput from "../../formInput/FormInput";
import { FormField } from "../../../types/types";
import { useFormValidations } from "../../../hooks/useFormValidations";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAxios } from "../../../hooks/useAxios";
import { useAppDispatch, useAppSelector, windowSelector, workerActions } from "../../../redux";
import { fetchQueryLiveSearchResults, fetchUserLiveSearchResults } from "../../../redux/worker/worker.async-actions";

interface liveSearchFormState {
   livesearch: FormField;
}

interface liveSearchProps {
   extraClassName?: string;
   focusRef: any;
   type: Livesearch;
   regexp: RegExp;
}

export enum Livesearch {
   PHONE_NUMBER,
   VIRTUAL_CART
}

const LiveSearch: FC<liveSearchProps> = ({ extraClassName, focusRef, type, regexp }) => {
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
         switch (type) {
            case Livesearch.VIRTUAL_CART:
               dispatch(workerActions.overrideProductQueryResults([]));
               break;
            case Livesearch.PHONE_NUMBER:
               dispatch(workerActions.overrideUserQueryResults([]));

               break;
         }
      } else {
         switch (type) {
            case Livesearch.VIRTUAL_CART:
               dispatch(fetchQueryLiveSearchResults(query, client));
               break;
            case Livesearch.PHONE_NUMBER:
               dispatch(fetchUserLiveSearchResults(query, client));
               break;
         }
      }
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

   const typedPlaceholder = useMemo(() => {
      switch (type) {
         case Livesearch.PHONE_NUMBER:
            return "Номер пользователя...";
         case Livesearch.VIRTUAL_CART:
            return "Название продукта... ";
      }
   }, [type]);
   const correctLabelValue = useMemo(() => {
      switch (type) {
         case Livesearch.VIRTUAL_CART:
            return "";
         case Livesearch.PHONE_NUMBER:
            return "+7";
      }
   }, []);

   return (
      <div className={`live_search ${extraClassName || ""}`}>
         <FormInput
            name={"livesearch"}
            type={"text"}
            placeholder={typedPlaceholder}
            fieldValidationFn={minLengthValidation}
            minLength={type === Livesearch.PHONE_NUMBER ? 11 : 2}
            extraClassName={"ls_input"}
            onBlurValue={correctLabelValue}
            formValue={formValues.livesearch}
            setV={setFormValues}
            isActiveForValidation={true}
            focusRef={focusRef}
            Regexp={regexp}
         />

         <button className="live_search_button">Найти</button>
      </div>
   );
};

export default LiveSearch;
