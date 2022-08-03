import React, { FC } from "react";
import "./nutrient-list.styles.scss";
import { nutrients } from "../../../common/types";
import { useMediaQuery } from "react-responsive";

interface nutrientListProps {
   children?: any;
   nutrients: nutrients;
   isPresentingNow: boolean;
}

const NutrientList: FC<nutrientListProps> = ({ children, nutrients, isPresentingNow }) => {
   const isShownAsList = useMediaQuery({ maxWidth: 767 });

   const asList = (
      <ul className={isPresentingNow ? "nutrients_list presentation" : "nutrients_list"}>
         <li className="nutrient">
            <p>Жиры: {nutrients.fats}г</p>
         </li>
         <li className="nutrient">
            <p>Углеводы: {nutrients.carbs}г</p>
         </li>
         <li className="nutrient">
            <p>Белки: {nutrients.proteins}г</p>
         </li>
         {children && children}
      </ul>
   );

   const asRow = (
      <div className="nutrients_list row">
         <p className="nutrient row">Жиры: {nutrients.fats}г |</p>
         <p className="nutrient row">Углеводы: {nutrients.carbs}г |</p>
         <p className="nutrient row">Белки: {nutrients.proteins}г</p>
      </div>
   );

   if (isShownAsList) return asList;

   return asRow;
};

export default NutrientList;
