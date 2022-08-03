import React, { FC } from "react";
import "./product-bg.styles.scss";

interface ProductBackgroundProps {
   forPresentation: boolean;
}

const ProductBackground: FC<ProductBackgroundProps> = ({ forPresentation }) => {
   return (
      <div className={forPresentation ? "product_background --for-presentation" : "product_background"}>
         <svg
            width="312"
            height="216"
            preserveAspectRatio="none"
            viewBox="0 0 312 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={forPresentation ? "card_bg --for-presentation" : "card_bg"}>
            <path
               className="pizza-bg-part"
               d="M8 7.85454C8 7.85454 82.6146 0 156 0C229.385 0 304 7.85454 304 7.85454C304 7.85454 312 64.4495 312 108C312 151.551 304 208.145 304 208.145C304 208.145 229.385 216 156 216C82.6146 216 8 208.145 8 208.145C8 208.145 0 151.551 0 108C0 64.4495 8 7.85454 8 7.85454Z"
               fill="#ECEDED"
            />
         </svg>
      </div>
   );
};

export default ProductBackground;
