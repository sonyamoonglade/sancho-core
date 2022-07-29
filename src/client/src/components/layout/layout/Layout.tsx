import React, { FC, useContext, useRef } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../../header/Header";
import { useRoutes } from "../../../hooks/useRoutes";
import { productActions, productSelector, useAppDispatch, useAppSelector, userSelector } from "../../../redux";
import WorkerAppForm from "../../worker/workerAppForm/WorkerAppForm";
import CreateOrderModal from "../../worker/modal/createOrder/CreateOrderModal";
import VerifyOrderModal from "../../worker/modal/verifyOrder/VerifyOrderModal";
import CancelOrderModal from "../../worker/modal/cancelOrder/CancelOrderModal";
import CompleteOrderDrag from "../../worker/drag/complete/CompleteOrderDrag";
import CancelOrderDrag from "../../worker/drag/cancel/CancelOrderDrag";
import VerifyOrderDrag from "../../worker/drag/verify/VerifyOrderDrag";
import CompleteOrderModal from "../../worker/modal/completeOrder/CompleteOrderModal";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminCatalog from "../../admin/catalog/AdminCatalog";
import Dashboard from "../../admin/dashboard/Dashboard";
import Users from "../../admin/users/Users";
import Orders from "../../admin/orders/Orders";
import AdminQueue from "../../admin/queue/AdminQueue";
import MarkList from "../../worker/markList/MarkList";
import MarkModal from "../../worker/modal/mark/MarkModal";
import { CatalogContext, LayoutContext } from "../context";
import DetailsModal from "../../worker/modal/details/DetailsModal";
import { useCategories } from "../hooks/useCategories";
import Modals from "../../ui/worker/Modals";
import Drags from "../../ui/worker/Drags";

interface layoutProps {
   children: any;
}

const Layout: FC<layoutProps> = ({ children }) => {
   const { isWorkerAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const routes = useRoutes(isWorkerAuthenticated, isMasterAuthenticated);
   const { catalogRef } = useContext(CatalogContext);
   const layoutRef = useRef<HTMLDivElement>(null);
   const isCategSet = useRef(false);
   const { findClosest, fillUpAdj } = useCategories(catalogRef);

   const approx = 136;

   return (
      <div
         ref={layoutRef}
         onScroll={() => {
            if (!isCategSet.current) {
               if (catalogRef.current !== null) {
                  fillUpAdj();
                  isCategSet.current = true;
               }
            }
            const currScroll = layoutRef.current.scrollTop;
            findClosest(currScroll + approx);
         }}
         className={isWorkerAuthenticated ? "layout --no-overflow" : "layout"}>
         <Header />

         <LayoutContext.Provider
            value={{
               layoutRef
            }}>
            {isWorkerAuthenticated || isMasterAuthenticated ? null : children}
         </LayoutContext.Provider>

         {isWorkerAuthenticated && (
            <>
               <Modals />
               <Drags />
            </>
         )}
         {routes}
      </div>
   );
};

export default Layout;
