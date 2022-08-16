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
   minLength?: number;
   required?: boolean;
}

const RectangleInput: FC<RectangleInputProps> = ({
   value,
   setValue,
   disabled,
   regexp,
   name,
   extraClass,
   width,
   maxLength,
   placeholder,
   required,
   minLength
}) => {
   return (
      <input
         required={required}
         minLength={minLength}
         style={width && { width }}
         name={name}
         type={"text"}
         maxLength={maxLength && maxLength}
         disabled={disabled}
         className={`rectangle_input ${extraClass || ""}`}
         value={value}
         placeholder={placeholder ? placeholder : ""}
         onChange={(e) => {
            const v = e.target.value;
            const match = v.match(regexp);
            //todo: change for
            const res = match && match["0"] === match.input;
            if (!res && v.length !== 0) {
               return;
            }
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
