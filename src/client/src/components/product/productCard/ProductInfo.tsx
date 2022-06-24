import React, { FC } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { productSlice, useAppDispatch } from "../../../redux";
import { baseUrl } from "../productPresentation/ProductPresentation";
import { Product } from "../../../common/types";
import NutrientList from "../nutrient/NutrientList";

interface productInfoProps {
   product: Product;
   children?: any;
}
const productActions = productSlice.actions;

const ProductInfo: FC<productInfoProps> = ({ product, children }) => {
   const { category, description, features } = product;

   const dispatch = useAppDispatch();

   function startPresentationFn(product: Product) {
      dispatch(productActions.startPresentation(product));
   }

   return (
      <div className="product_info">
         <div className="preview">
            <p className="category">{category}</p>
            <img className="image" src={`${baseUrl}/${product.id}.png`} alt="" />
            <button className="start-presentation_btn" onClick={() => startPresentationFn(product)}>
               <AiOutlinePlus className="add_btn_plus_icon" size={25} />
            </button>
         </div>
         {children && children}
         <div className="text_info">
            <p className="description">{description}</p>
            {features.nutrients !== undefined && (
               <NutrientList isPresentingNow={false} nutrients={features.nutrients}>
                  {features.energy_value !== undefined && (
                     <li className="energy_value">
                        <p>{features.energy_value}ккал на 100г.</p>
                     </li>
                  )}
               </NutrientList>
            )}
            {features.volume !== undefined && (
               <p style={{ marginTop: "0.5rem", fontSize: "0.88rem" }} className="description">
                  Объем: {features.volume}мл
               </p>
            )}
         </div>
      </div>
   );
};

export default ProductInfo;
