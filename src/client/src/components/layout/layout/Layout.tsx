import React, { FC, useContext, useRef } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../header/Header";
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
import MarkList from "../../worker/mark/MarkList";
import MarkModal from "../../worker/modal/mark/MarkModal";
import { CatalogContext, LayoutContext } from "../context";

interface layoutProps {
   children: any;
}

const Layout: FC<layoutProps> = ({ children }) => {
   const { isWorkerAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const routes = useRoutes(isWorkerAuthenticated);
   const { categories } = useAppSelector(productSelector);
   const { catalogRef } = useContext(CatalogContext);
   const layoutRef = useRef<HTMLDivElement>(null);
   const isCategSet = useRef(false);
   const dispatch = useAppDispatch();
   const adjm = useRef<Map<string, number>>(null);

   function fillUpAdj(): Map<string, number> {
      if (catalogRef.current !== null) {
         const m = new Map<string, number>();
         for (const cat of categories) {
            for (const child of catalogRef?.current.children) {
               if (cat.value === child.id) {
                  const bounds = (child as HTMLElement).getBoundingClientRect();
                  m.set(cat.value, Math.round(bounds.top));
               }
            }
         }
         adjm.current = m;
         const mapLikeObj = mapToObj(m);
         dispatch(productActions.setCategoriesAdj(JSON.stringify(mapLikeObj)));
         return m;
      }
      return null;
   }
   function mapToObj(m: Map<string, any>): object {
      return Array.from(m).reduce((out, [k, v]) => {
         out[k] = v;
         return out;
      }, {} as any);
   }

   function findClosest(v: number): string {
      for (const [k, mv] of adjm.current.entries()) {
         const currCateg = categories.find((c) => c.active);
         if (v * 0.95 < mv && v * 1.05 > mv) {
            dispatch(productActions.activateCategory(k));
            break;
         } else if (v < adjm.current.get(currCateg.value)) {
            const currIdx = categories.findIndex((c) => c.active);
            if (currIdx > 0) {
               const next = categories[currIdx - 1];
               dispatch(productActions.activateCategory(next.value));
            }
         }
      }

      return "";
   }

   return (
      <div
         ref={layoutRef}
         onScroll={(e) => {
            if (!isCategSet.current) {
               if (catalogRef.current !== null) {
                  fillUpAdj();
                  isCategSet.current = true;
               }
            }
            const currScroll = layoutRef.current.scrollTop;
            findClosest(currScroll + 136);
         }}
         className={isWorkerAuthenticated ? "layout --no-overflow" : "layout"}>
         <Header />

         <LayoutContext.Provider
            value={{
               layoutRef
            }}>
            {isWorkerAuthenticated || isMasterAuthenticated ? null : children}
         </LayoutContext.Provider>
         {routes}

         {isWorkerAuthenticated ? (
            <>
               <>
                  <VerifyOrderModal />
                  <CreateOrderModal />
                  <CancelOrderModal />
                  <CompleteOrderModal />
                  <WorkerAppForm />
                  <MarkList />
                  <MarkModal />
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
