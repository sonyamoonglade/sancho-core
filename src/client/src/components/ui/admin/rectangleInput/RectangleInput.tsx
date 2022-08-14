import React, { FC } from "react";
import "./rect-input.styles.scss";

interface RectangleInputProps {
   value: any;
   setValue: Function;
   disabled: boolean;
   regexp?: RegExp;
   name: string;
   extraClass?: string;
   width?: number;
   maxLength?: number;
   placeholder?: string;
}

const RectangleInput: FC<RectangleInputProps> = ({ value, setValue, disabled, regexp, name, extraClass, width, maxLength, placeholder }) => {
   return (
      <input
         style={width && { width }}
         name={name}
         type={"text"}
         maxLength={maxLength && maxLength}
         pattern={regexp && regexp.source}
         disabled={disabled}
         className={`rectangle_input ${extraClass || ""}`}
         value={value}
         placeholder={placeholder ? placeholder : ""}
         onChange={(e) => {
            const v = e.target.value;
            setValue((state: any) => {
               const copy = Object.assign({}, state);
               copy[name] = v;
               return { ...copy };
            });
         }}
      />
   );
};

export default RectangleInput;
