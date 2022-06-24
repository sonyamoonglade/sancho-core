import React, { FC, useEffect, useRef } from "react";
import { BiShoppingBag } from "react-icons/bi";
import CartButton from "../cartButton/CartButton";
import { productActions, productSelector, useAppDispatch, useAppSelector, windowActions } from "../../../redux";
import { CartInterface } from "../../../types/types";
import { DatabaseCartProduct } from "../../../common/types";
import { currency } from "../../../common/constants";

interface addToCartOnPresentationProps {
   addToCart: any;
   isProductInCart: DatabaseCartProduct;
   cart: CartInterface;
   isNotified: boolean;
}

const AddToCartBtn: FC<addToCartOnPresentationProps> = (props) => {
   const { addToCart, isProductInCart, cart, isNotified } = props;

   const { totalCartPrice, presentedProductCartQuantity, presentedProduct } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();

   const jumpAnimationRef = useRef<HTMLDivElement>(null);

   function openCart() {
      dispatch(productActions.stopPresentation());
      dispatch(windowActions.toggleCart());
   }

   useEffect(() => {
      jumpAnimationRef.current.animate([{ transform: "translateY(0)" }, { transform: "translateY(-1px)" }, { transform: "translateY(0px)" }], {
         duration: 300,
         iterations: 1,
         easing: "ease-in-out"
      });
   }, [presentedProductCartQuantity]);
   return (
      <div onClick={() => addToCart(presentedProduct)} className="add_to_cart_btn">
         <div className="cart_icon_container" ref={jumpAnimationRef}>
            {isNotified && <div className="notification_dot">&nbsp;</div>}
            <span>
               <BiShoppingBag onClick={() => openCart()} size={25} className="add_to_cart_icon" />
            </span>
         </div>
         {isProductInCart ? (
            <CartButton quantity={presentedProductCartQuantity} cart={cart} />
         ) : (
            <p style={{ transform: "translateX(3px)" }}>Добавить в корзину</p>
         )}
         <p className="total_cart_price">
            {totalCartPrice} {currency}
         </p>
      </div>
   );
};

export default React.memo(AddToCartBtn);
