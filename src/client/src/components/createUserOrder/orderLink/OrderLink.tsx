import React, { useEffect, useRef } from "react";
import { GoVerified } from "react-icons/go";

import "./order-link.styles.scss";
import { productSelector, useAppDispatch, useAppSelector, windowActions } from "../../../redux";
import { currency } from "../../../common/constants";

const OrderLink = () => {
   const animationRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      startAnimation();
   }, []);

   const dispatch = useAppDispatch();
   const { totalCartPrice } = useAppSelector(productSelector);

   function startAnimation() {
      animationRef.current.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], {
         duration: 400,
         easing: "ease",
         delay: 0
      });
   }

   function toggleOrder() {
      if (totalCartPrice === 0) {
         return;
      }
      dispatch(windowActions.toggleUserOrder());
   }

   return (
      <button onClick={() => toggleOrder()} ref={animationRef} className="order_link">
         <span className="order_icon">
            <GoVerified size={30} />
         </span>
         <span className="order_title">Заказать</span>
         <span className="total_cart_price link">
            {totalCartPrice}
            {currency}
         </span>
      </button>
   );
};

export default OrderLink;
