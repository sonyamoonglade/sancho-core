import React, { FC } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../header/Header";
import { useRoutes } from "../../../hooks/useRoutes";
import { useAppSelector, userSelector } from "../../../redux";
import WorkerAppForm from "../../worker/workerAppForm/WorkerAppForm";
import CreateOrderModal from "../../worker/modal/createOrder/CreateOrderModal";
import VerifyOrderModal from "../../worker/modal/verifyOrder/VerifyOrderModal";
import CancelOrderModal from "../../worker/modal/cancelOrder/CancelOrderModal";
import CompleteOrderDrag from "../../worker/drag/complete/CompleteOrderDrag";
import CancelOrderDrag from "../../worker/drag/cancel/CancelOrderDrag";
import VerifyOrderDrag from "../../worker/drag/verify/VerifyOrderDrag";
import CompleteOrderModal from "../../worker/modal/completeOrder/CompleteOrderModal";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminCatalog from "../../admin/catalog/AdminCatalog";
import Dashboard from "../../admin/dashboard/Dashboard";
import Users from "../../admin/users/Users";
import Orders from "../../admin/orders/Orders";
import AdminQueue from "../../admin/queue/AdminQueue";
interface layoutProps {
   children: any;
}

const Layout: FC<layoutProps> = ({ children }) => {
   const { isWorkerAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const routes = useRoutes(isWorkerAuthenticated);
   return (
      <div className={isWorkerAuthenticated ? "layout --no-overflow" : "layout"}>
         <Header />

         {isWorkerAuthenticated || isMasterAuthenticated ? null : children}

         {routes}

         {isWorkerAuthenticated ? (
            <>
               <>
                  <VerifyOrderModal />
                  <CreateOrderModal />
                  <CancelOrderModal />
                  <CompleteOrderModal />
                  <WorkerAppForm />
               </>
               <>
                  <CompleteOrderDrag />
                  <CancelOrderDrag />
                  <VerifyOrderDrag />
               </>
            </>
         ) : isMasterAuthenticated ? (
            <Routes>
               <Route path={"/admin/dashboard"} element={<Dashboard />} />
               <Route path={"/admin/users"} element={<Users />} />
               <Route path={"/admin/orders"} element={<Orders />} />
               <Route path={"/admin/queue"} element={<AdminQueue />} />

               <Route path={"/admin/catalog"} element={<AdminCatalog />} />
               <Route path={"*"} element={<Navigate to="/admin/dashboard" />} />
            </Routes>
         ) : null}
      </div>
   );
};

export default Layout;
