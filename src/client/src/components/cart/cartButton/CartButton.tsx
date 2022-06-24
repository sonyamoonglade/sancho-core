import React, { FC, useEffect, useRef, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import "./cart-button.styles.scss";
import { productSelector, productSlice, useAppDispatch, useAppSelector } from "../../../redux";
import { CartInterface } from "../../../types/types";
import { DatabaseCartProduct } from "../../../common/types";

interface cartButtonProps {
   quantity: number;
   cart: CartInterface;
}

const productActions = productSlice.actions;

const CartButton: FC<cartButtonProps> = ({ quantity, cart }) => {
   const animationRef = useRef<HTMLSpanElement>(null);
   const animationRef2 = useRef(null);

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
      animationRef.current.animate([{ width: "10%" }, { width: "30%" }], {
         duration: 500,
         easing: "ease-in",
         fill: "forwards",
         delay: 300
      }).onfinish = function () {
         setTransitionEnd(true);
      };
   }

   function startSlideBackAnimation() {
      animationRef.current.animate([{ width: "30%" }, { width: "10%" }], {
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
         quantity: 1
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
            <AiOutlineMinus size={25} />
         </div>
         <p ref={animationRef2} className={transitionEnd ? "product_quantity" : "product_quantity hidden"}>
            {quantity}
         </p>
         <div onClick={() => incrementProductQuantity()} className="incart_btn">
            <AiOutlinePlus size={25} />
         </div>
      </span>
   );
};

export default CartButton;
