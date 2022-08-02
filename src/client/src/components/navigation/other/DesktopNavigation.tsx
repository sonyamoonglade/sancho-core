import React from "react";
import "./desktop-nav.styles.scss";
import { useAppDispatch, windowActions } from "../../../redux";

const DesktopNavigation = () => {
   const dispatch = useAppDispatch();
   function toggleOrderHistory() {
      dispatch(windowActions.toggleOrderHistory());
   }

   return (
      <ul className="desktop_nav">
         <li className="d_nav_item">Меню</li>
         <li className="d_nav_item">О нас</li>
         <li className="d_nav_item" onClick={toggleOrderHistory}>
            Мои заказы
         </li>
      </ul>
   );
};

export default DesktopNavigation;
