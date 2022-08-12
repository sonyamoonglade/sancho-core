import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import "./cart-button.styles.scss";
import { productSelector, productSlice, useAppDispatch, useAppSelector } from "../../../redux";
import { CartInterface } from "../../../types/types";
import { DatabaseCartProduct } from "../../../common/types";
import { useMediaQuery } from "react-responsive";

interface cartButtonProps {
   quantity: number;
   cart: CartInterface;
}

const productActions = productSlice.actions;

const CartButton: FC<cartButtonProps> = ({ quantity, cart }) => {
   const animationRef = useRef<HTMLSpanElement>(null);
   const animationRef2 = useRef(null);

   const h = useMemo(() => window.screen.height, [window.screen]);

   const iconw = useMemo(() => {
      switch (true) {
         case h < 700:
            return 25;
         case h < 800:
            return 30;
         case h < 900:
            return 35;
         default:
            return 40;
      }
   }, [h]);

   const [transitionEnd, setTransitionEnd] = useState<boolean>(false);

   const { isPresentingNow, presentedProduct } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();

   useEffect(() => {
      startSlideAnimation();

      if (!isPresentingNow) {
         setTransitionEnd(false);
         startSlideBackAnimation();
      }
   }, [isPresentingNow]);

   function startSlideAnimation() {
      animationRef.current.animate([{ width: "10%" }, { width: "40%" }], {
         duration: 500,
         easing: "ease-in",
         fill: "forwards",
         delay: 300
      }).onfinish = function () {
         setTransitionEnd(true);
      };
   }

   function startSlideBackAnimation() {
      animationRef.current.animate([{ width: "40%" }, { width: "10%" }], {
         duration: 10,
         easing: "ease-in"
      }).onfinish = function () {
         setTransitionEnd(false);
      };
   }

   function incrementProductQuantity() {
      const { id, price, translate } = presentedProduct;
      const p: DatabaseCartProduct = {
         category: presentedProduct.category,
         id,
         price,
         translate,
         quantity: 1,
         image_url: presentedProduct.image_url
      };
      cart.addProduct(p);
      const totalCartPrice = cart.calculateCartTotalPrice();
      dispatch(productActions.setTotalCartPrice(totalCartPrice));
      const newQuantity = cart.getById(id).quantity;
      dispatch(productActions.setPresentedProductQuantity(newQuantity));
   }

   function decrementProductQuantity() {
      const { id } = presentedProduct;
      cart.removeProduct(id);
      const totalCartPrice = cart.calculateCartTotalPrice();
      dispatch(productActions.setTotalCartPrice(totalCartPrice));
      const newQuantity = cart.getById(id)?.quantity || 0;
      dispatch(productActions.setPresentedProductQuantity(newQuantity));
   }

   return (
      <span ref={animationRef} className="product_button">
         <div onClick={() => decrementProductQuantity()} className={transitionEnd ? "incart_btn" : "incart_btn hidden"}>
            <AiOutlineMinus size={iconw} />
         </div>
         <p ref={animationRef2} className={transitionEnd ? "product_quantity" : "product_quantity hidden"}>
            {quantity}
         </p>
         <div onClick={() => incrementProductQuantity()} className="incart_btn">
            <AiOutlinePlus size={iconw} />
         </div>
      </span>
   );
};

export default CartButton;
