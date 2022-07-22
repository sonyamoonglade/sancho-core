import React, { useEffect, useRef } from "react";
import { orderSelector, useAppDispatch, useAppSelector, windowActions } from "../../../redux";
import { BsCreditCard } from "react-icons/bs";
import "./pay-link.styles.scss";
const PayLink = () => {
   const dispatch = useAppDispatch();
   const animationRef = useRef<HTMLButtonElement>(null);
   const { canPay } = useAppSelector(orderSelector);
   useEffect(() => {
      startAnimation();
   }, []);

   function togglePay() {
      if (!canPay) {
         return;
      }
      dispatch(windowActions.togglePay(true));
   }

   function startAnimation() {
      animationRef.current.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], {
         duration: 400,
         easing: "ease",
         delay: 0
      });
   }

   return (
      <button ref={animationRef} onClick={() => togglePay()} className="pay_link">
         <span className="xhlp18z">&nbsp;</span>
         <span className="cart_link_title">Перейти к оплате</span>
         <BsCreditCard className="pay_icon" size={25} />
      </button>
   );
};

export default PayLink;
