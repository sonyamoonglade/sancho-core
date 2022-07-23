import React, { FC } from "react";

import "./product-card.styles.scss";
import ProductHeading from "./ProductHeading";
import ProductInfo from "./ProductInfo";
import { Product } from "../../../common/types";
import { useMediaQuery } from "react-responsive";

interface productCardProps {
   product: Product;
   id?: string;
}

const ProductCard: FC<productCardProps> = ({ product, id }) => {
   const isSmallDevice = useMediaQuery({ maxWidth: 767 });

   const forSmallDevices = (
      <div className="product_card" id={id}>
         <ProductHeading name={product.translate} translate={product.name} price={product.price} isTranslateShown={isSmallDevice} />
         <ProductInfo product={product} />
      </div>
   );

   const forLargerDevices = (
      <div className="product_card" id={id}>
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
