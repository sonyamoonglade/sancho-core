import React, { useEffect, useState } from "react";
import { productActions, productSelector, useAppDispatch, useAppSelector } from "../../../redux";
import "../productCard/product-card.styles.scss";
import "./product-present.styles.scss";
import { useCart } from "../../../hooks/useCart";
import "../../layout/layout/layout.styles.scss";
import AddToCartOnPresentation from "../../cart/addToCartButton/AddToCartBtn";
import NutrientList from "../nutrient/NutrientList";
import { usePresentation } from "./hooks/usePresentation";
import { currency } from "../../../common/constants";

const ProductPresentation = () => {
   const cart = useCart();
   const { presentedProduct, isPresentingNow, presentedProductCartQuantity, totalCartPrice } = useAppSelector(productSelector);

   const { splitLongName, checkIsInCart, addToCart, startingQuantity, productImage, isLongName, longName, isProductInCart } = usePresentation(
      isPresentingNow,
      presentedProduct
   );
   const dispatch = useAppDispatch();
   const [isNotified, setIsNotified] = useState<boolean>(false);

   useEffect(() => {
      if (presentedProduct !== null) {
         splitLongName();
         checkIsInCart(presentedProduct.id);
      }
   }, [isPresentingNow, totalCartPrice]);
   useEffect(() => {
      if (startingQuantity < presentedProductCartQuantity) {
         setIsNotified(true);
      } else {
         setIsNotified(false);
      }
   }, [presentedProductCartQuantity, totalCartPrice]);

   function hide() {
      dispatch(productActions.stopPresentation());
   }

   return (
      <div className={isPresentingNow ? "product_presentation" : "product_presentation hidden"}>
         {presentedProduct !== null && (
            <>
               <div className="top_part">
                  <div className="title presentation">
                     <span>
                        <p className="name presentation">{presentedProduct.translate}</p>
                     </span>
                     <p className="price">
                        {presentedProduct.price} {currency}
                     </p>
                  </div>
                  <img className="image presentation" src={productImage} alt="Изображение" onTouchEnd={() => hide()} />
                  <div className="miscellaneous">
                     <div>
                        <p className="description">{presentedProduct.description}</p>
                        {presentedProduct.features.nutrients && (
                           <NutrientList isPresentingNow={isPresentingNow} nutrients={presentedProduct.features.nutrients} />
                        )}
                     </div>
                  </div>
               </div>
               <AddToCartOnPresentation isProductInCart={isProductInCart} cart={cart} addToCart={addToCart} isNotified={isNotified} />
            </>
         )}
      </div>
   );
};

export default ProductPresentation;
