import React from "react";
import { useAppDispatch, windowActions } from "../../../redux";
import { useNavigate } from "react-router-dom";

const AdminNavigation = () => {
   const dispatch = useAppDispatch();
   const router = useNavigate();
   function toggleOrderCreation() {
      dispatch(windowActions.toggleCreateOrder());
   }

   function route(n: number) {
      const baseUrl = "/admin";
      switch (n) {
         case 0:
            router(baseUrl + "/catalog", { replace: true });
            break;
         case 1:
            router(baseUrl + "/users", { replace: true });
            break;
         case 2:
            router(baseUrl + "/orders", { replace: true });
            break;
         case 3:
            router(baseUrl + "/queue", { replace: true });
            break;
      }
   }

   return (
      <ul className="desktop_nav">
         <li className="d_nav_item" onClick={() => route(0)}>
            Каталог
         </li>
         <li className="d_nav_item" onClick={() => route(1)}>
            Пользователи
         </li>
         <li className="d_nav_item" onClick={() => route(2)}>
            Все заказы
         </li>
         <li className="d_nav_item" onClick={() => route(3)}>
            Лента в реальном времени
         </li>
      </ul>
   );
};

export default AdminNavigation;
