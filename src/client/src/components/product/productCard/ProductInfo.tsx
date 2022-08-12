import React, { FC } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { productSlice, useAppDispatch } from "../../../redux";
import { Product } from "../../../common/types";
import NutrientList from "../nutrient/NutrientList";
import ProductBackground from "../../ui/productBg/ProductBackground";
import { useCategoriesColor } from "./hooks/useCategoriesColor";

interface productInfoProps {
   product: Product;
   children?: any;
}
const productActions = productSlice.actions;

const ProductInfo: FC<productInfoProps> = ({ product, children }) => {
   const { category, description, features } = product;

   const dispatch = useAppDispatch();

   const categColorCls = useCategoriesColor(category);

   function startPresentationFn(product: Product) {
      dispatch(productActions.startPresentation(product));
   }

   return (
      <div className="product_info">
         <div className="preview">
            <p className={`category ${categColorCls}`}>{category}</p>
            <ProductBackground forPresentation={false} />
            <img onClick={() => startPresentationFn(product)} className="image" src={product.image_url} alt="" />
            <button className="start-presentation_btn" onClick={() => startPresentationFn(product)}>
               <AiOutlinePlus className="add_btn_plus_icon" size={25} />
            </button>
         </div>
         {children && children}
         <div className="text_info">
            <p className="description">{description}</p>
            {features.nutrients && (
               <NutrientList isPresentingNow={false} nutrients={features.nutrients}>
                  {features.energy_value && (
                     <li className="energy_value">
                        <p>{features.energy_value}ккал на 100г.</p>
                     </li>
                  )}
               </NutrientList>
            )}
            {features.volume !== 0 && features.volume && <p className="description bot">Объем: {features.volume}мл</p>}
            {features.weight !== 0 && features.weight && !features.volume && <p className="description bot">Вес: {features.weight}гр</p>}
         </div>
      </div>
   );
};

export default ProductInfo;
