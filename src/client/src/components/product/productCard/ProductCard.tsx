import React, { FC } from "react";

import "./product-card.styles.scss";
import ProductHeading from "./ProductHeading";
import ProductInfo from "./ProductInfo";
import { Product } from "../../../common/types";
import { useMediaQuery } from "react-responsive";

interface productCardProps {
   product: Product;
}

const ProductCard: FC<productCardProps> = ({ product }) => {
   const isSmallDevice = useMediaQuery({ maxWidth: 767 });

   const forSmallDevices = (
      <div className="product_card">
         <ProductHeading name={product.translate} translate={product.name} price={product.price} isTranslateShown={isSmallDevice} />
         <ProductInfo product={product} />
      </div>
   );

   const forLargerDevices = (
      <div className="product_card">
         <ProductInfo product={product}>
            <ProductHeading name={product.translate} translate={product.name} price={product.price} isTranslateShown={isSmallDevice} />
         </ProductInfo>
      </div>
   );

   if (isSmallDevice) {
      return forSmallDevices;
   }
   return forLargerDevices;
};

export default ProductCard;
