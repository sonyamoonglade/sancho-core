import React from "react";
import { useAppDispatch, windowActions } from "../../../redux";

const WorkerNavigation = () => {
   const dispatch = useAppDispatch();

   function toggleOrderCreation() {
      dispatch(windowActions.toggleCreateOrder());
   }

   return (
      <ul className="desktop_nav">
         <li className="d_nav_item" onClick={toggleOrderCreation}>
            Создать заказ
         </li>
      </ul>
   );
};

export default WorkerNavigation;
