import React, { useEffect } from "react";
import { BiShoppingBag } from "react-icons/bi";

import "./cart-link.styles.scss";
import { productSelector, useAppDispatch, useAppSelector, windowActions } from "../../../redux";
import { currency } from "../../../common/constants";

const CartLink = () => {
   const { totalCartPrice, isCartEmpty } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();

   function toggleCart() {
      dispatch(windowActions.toggleCart());
   }

   useEffect(() => {
      if (isCartEmpty) dispatch(windowActions.toggleCart());
   }, [isCartEmpty]);

   return (
      <button onClick={() => toggleCart()} className="cart_link">
         <BiShoppingBag className="cart_link_icon" size={30} />
         <span className="cart_link_title">Корзина</span>
         <span className="cart_price link">
            {totalCartPrice} {currency}
         </span>
      </button>
   );
};

export default CartLink;
