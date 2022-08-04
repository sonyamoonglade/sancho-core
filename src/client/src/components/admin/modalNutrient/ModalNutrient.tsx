import React, { FC } from "react";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";

interface ModalNutrientProps {
   value: any;
   setValue: Function;
   name: string;
}

const ModalNutrient: FC<ModalNutrientProps> = ({ setValue, value, name }) => {
   return (
      <span>
         <p>Углеводы:</p>
         <div>
            <RectangleInput maxLength={3} width={50} value={value} setValue={setValue} disabled={false} name={name} />
            <strong>&nbsp;гр</strong>
         </div>
      </span>
   );
};

export default ModalNutrient;
