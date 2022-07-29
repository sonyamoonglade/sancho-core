import React, { FC, HTMLInputTypeAttribute, useEffect, useState } from "react";
import "./form-input.styles.scss";
import { FormField } from "../../../types/types";
import EventEmitter from "events";

interface formInputProps {
   name: string;
   type: HTMLInputTypeAttribute;
   placeholder: string;
   setV: Function;
   fieldValidationFn?: Function;
   onBlurValue: string;
   maxLength?: number;
   extraClassName?: string;
   Regexp?: RegExp;
   minLength: number;
   isActiveForValidation?: boolean;
   formValue: FormField;
   focusRef?: any;
   emitter?: EventEmitter;
}

const FormInput: FC<formInputProps> = (props) => {
   const [inputTagClasses, setInputTagClasses] = useState<string[]>([]);

   const {
      type,
      name,
      placeholder,
      formValue,
      setV,
      fieldValidationFn,
      onBlurValue,
      maxLength,
      extraClassName,
      Regexp,
      minLength,
      emitter,
      isActiveForValidation,
      focusRef
   } = props;

   const { value: v, isValid } = formValue;

   useEffect(() => {
      if (!isValid) {
         return setInputTagClasses((p) => ["--invalid"]);
      } else {
         setInputTagClasses((p) => ["--valid"]);
      }
   }, [isValid, isActiveForValidation, isValid]);

   return (
      <div className={`${extraClassName || ""} form_input_container ${inputTagClasses.join(" ")}`}>
         <label htmlFor={name} className="form_input_label">
            {onBlurValue}
         </label>

         <input
            ref={focusRef ? focusRef : null}
            onBlur={(e) => {
               emitter !== undefined &&
                  setTimeout(() => {
                     emitter.emit("blur");
                  }, 20);
               if (v.trim().length < minLength || v.trim().length === 0) {
                  setV((state: any) => {
                     const obj: { value: string; isValid: boolean } = {
                        value: state[e.target.name].value,
                        isValid: state[e.target.name].isValid
                     };

                     obj.value = "";
                     return { ...state, [e.target.name]: obj };
                  });
               }
               return;
            }}
            placeholder={placeholder}
            type={type}
            maxLength={maxLength || 100}
            name={name}
            value={v}
            onFocus={() => emitter !== undefined && emitter.emit("autocomplete")}
            onChange={(e) => {
               const inputValue = e.target.value;
               if (Regexp && inputValue.match(Regexp)) {
                  return;
               }
               let validationResult = false;
               if (fieldValidationFn !== undefined) {
                  validationResult = fieldValidationFn(inputValue, minLength);
                  setV((state: any) => {
                     const obj = {
                        value: e.target.value,
                        isValid: validationResult
                     };
                     return { ...state, [e.target.name]: obj };
                  });
               }
            }}
            className={`form_input`}
         />
      </div>
   );
};

export default React.memo(FormInput);
