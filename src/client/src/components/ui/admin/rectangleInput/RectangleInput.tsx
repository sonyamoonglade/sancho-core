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
}

const RectangleInput: FC<RectangleInputProps> = ({ value, setValue, disabled, regexp, name, extraClass, width }) => {
   return (
      <input
         style={width && { width }}
         name={name}
         type={"text"}
         pattern={regexp && regexp.source}
         disabled={disabled}
         className={`rectangle_input ${extraClass || ""}`}
         value={value}
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
