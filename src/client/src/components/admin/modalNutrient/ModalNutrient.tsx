import React, { FC, useMemo } from "react";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";

interface ModalNutrientProps {
   value: any;
   setValue: Function;
   name: string;
}

const ModalNutrient: FC<ModalNutrientProps> = ({ setValue, value, name }) => {
   const title = useMemo(() => {
      let out: string;
      switch (name) {
         case "carbs":
            out = "Углеводы";
            break;
         case "proteins":
            out = "Белки";
            break;
         default:
            out = "Жиры";
      }
      return out;
   }, [name]);
   return (
      <span>
         <p>{title}:</p>
         <div>
            <RectangleInput maxLength={3} width={50} value={value} setValue={setValue} disabled={false} name={name} />
            <strong>&nbsp;гр</strong>
         </div>
      </span>
   );
};

export default ModalNutrient;
