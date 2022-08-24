import { Navigate, Route, Routes } from "react-router-dom";
import OrderQueueComponent from "../components/worker/queue/OrderQueueComponent";
import React, { useMemo } from "react";
import AdminQueue from "../components/admin/queue/AdminQueue";
import Catalog from "../pages/admin/Catalog";
import Users from "../pages/admin/Users";
import Subscriptions from "../pages/admin/Subscriptions";

export function useRoutes(isWorkerAuthenticated: boolean, isMasterAuthenticated: boolean) {
   const worker = useMemo(
      () => (
         <Routes>
            <Route path="/worker/queue" element={<OrderQueueComponent />} />
            <Route path="*" element={<Navigate to="/worker/queue" />} />
         </Routes>
      ),
      []
   );

   const master = useMemo(() => {
      return (
         <Routes>
            <Route path={"/admin/users"} element={<Users />} />
            <Route path={"/admin/subscriptions"} element={<Subscriptions />} />
            <Route path={"/admin/queue"} element={<AdminQueue />} />
            <Route path={"/admin/catalog"} element={<Catalog />} />
            <Route path={"*"} element={<Navigate to="/admin/catalog" />} />
         </Routes>
      );
   }, []);

   if (isWorkerAuthenticated) {
      return worker;
   }
   if (isMasterAuthenticated) {
      return master;
   }
   return null;
}
