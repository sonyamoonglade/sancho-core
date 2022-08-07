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
         case "weight":
            out = "Вес";
            break;
         case "volume":
            out = "Объем";
            break;
         case "carbs":
            out = "Углеводы";
            break;
         case "fats":
            out = "Жиры";
            break;
         case "proteins":
            out = "Белки";
      }
      return out;
   }, [name]);
   return (
      <span className="modal_nutrient">
         <p>{title}:</p>
         <div>
            <RectangleInput maxLength={3} width={70} value={value} setValue={setValue} disabled={false} name={name} />
         </div>
         <strong style={{ marginLeft: "0.2rem" }}>{title === "Объем" ? "мл" : "гр"}</strong>
      </span>
   );
};

export default ModalNutrient;
