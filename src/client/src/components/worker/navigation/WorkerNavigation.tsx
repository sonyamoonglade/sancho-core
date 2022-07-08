import React from "react";
import { useAppDispatch, windowActions } from "../../../redux";

const WorkerNavigation = () => {
   const dispatch = useAppDispatch();

   function toggleOrderCreation() {
      dispatch(windowActions.toggleCreateOrder());
   }

   function toggleMarkAdd() {
      dispatch(windowActions.toggleMark());
   }

   return (
      <ul className="desktop_nav">
         <li className="d_nav_item" onClick={toggleOrderCreation}>
            Создать заказ
         </li>
         <li className="d_nav_item" onClick={toggleMarkAdd}>
            Добавить метку
         </li>
      </ul>
   );
};

export default WorkerNavigation;
