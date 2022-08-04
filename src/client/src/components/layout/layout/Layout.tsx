import React, { FC, useContext, useRef } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../../header/Header";
import { useRoutes } from "../../../hooks/useRoutes";
import { productActions, productSelector, useAppDispatch, useAppSelector, userSelector } from "../../../redux";

import { CatalogContext, LayoutContext } from "../context";
import { useCategories } from "../hooks/useCategories";
import Modals from "../../ui/worker/Modals";
import Drags from "../../ui/worker/Drags";
import AdminAppForm from "../../admin/adminAppForm/AdminAppForm";

interface layoutProps {
   children: any;
}

const approx = 136;

const Layout: FC<layoutProps> = ({ children }) => {
   const { isWorkerAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const routes = useRoutes(isWorkerAuthenticated, isMasterAuthenticated);
   const { catalogRef } = useContext(CatalogContext);
   const layoutRef = useRef<HTMLDivElement>(null);
   const isCategSet = useRef(false);
   const { findClosest, fillUpAdj } = useCategories(catalogRef);

   return (
      <div
         ref={layoutRef}
         onScroll={() => {
            if (isMasterAuthenticated) {
               return;
            }
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
         {isMasterAuthenticated && <AdminAppForm />}
         {routes}
      </div>
   );
};

export default Layout;
