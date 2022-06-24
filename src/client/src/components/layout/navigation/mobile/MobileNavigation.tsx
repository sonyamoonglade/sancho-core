import React, { useEffect } from "react";
import { orderSelector, productSelector, useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../../../redux";
import { FaRegUserCircle } from "react-icons/fa";
import { BsCart4, BsClipboardData } from "react-icons/bs";
import { MdOutlineReceiptLong } from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import "./mob-navigation.styles.scss";
import "../../layout/layout.styles.scss";
import { OrderStatus } from "../../../../common/types";

const MobileNavigation = () => {
   const { navigation, navigationNotification } = useAppSelector(windowSelector);
   const { isCartEmpty } = useAppSelector(productSelector);
   const { orderHistory } = useAppSelector(orderSelector);
   const dispatch = useAppDispatch();

   useEffect(() => {
      const body = document.querySelector("body");
      if (navigation) {
         body.style.overflow = "hidden";
      } else {
         body.style.overflow = "visible";
      }
   }, [navigation]);

   return (
      <div className={navigation ? "modal modal--visible" : "modal"}>
         <ul className="nav_list">
            <li
               className="nav_item"
               onClick={() => {
                  dispatch(windowActions.toggleMasterLogin());
               }}>
               <p>Войти</p>
               <FaRegUserCircle />
            </li>
            <li className="nav_item">
               <p>О нас</p>
               <FcAbout />
            </li>
            <li className="nav_item">
               <p>Больше информации</p>
               <BsClipboardData />
            </li>
            <li
               onClick={() => {
                  dispatch(windowActions.toggleCart());
               }}
               className="nav_item">
               {!navigationNotification.cart && !isCartEmpty && <div className="navigation_dot">&nbsp;</div>}
               <p>Корзина</p>
               <BsCart4 />
            </li>
            <li
               className="nav_item"
               onClick={() => {
                  dispatch(windowActions.toggleOrderHistory());
               }}>
               {!navigationNotification.orders && orderHistory.find((o) => o.status === OrderStatus.waiting_for_verification) && (
                  <div className="navigation_dot order">&nbsp;</div>
               )}
               <p>Заказы</p>
               <MdOutlineReceiptLong />
            </li>
         </ul>
      </div>
   );
};

export default MobileNavigation;
