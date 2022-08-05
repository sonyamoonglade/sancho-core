import React, { FC, useContext, useEffect, useRef, useState } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../../header/Header";
import { useRoutes } from "../../../hooks/useRoutes";
import { adminSelector, productActions, productSelector, useAppDispatch, useAppSelector, userSelector } from "../../../redux";

import { CatalogContext, LayoutContext } from "../context";
import { useCategories } from "../hooks/useCategories";
import Modals from "../../ui/worker/Modals";
import Drags from "../../ui/worker/Drags";
import AdminAppForm from "../../admin/adminAppForm/AdminAppForm";
import { useRememberScroll } from "../../../hooks/useRememberScroll";
import { useDebounce } from "../../../hooks/useDebounce";
import { useEvents } from "../../../hooks/useEvents";
import { Events } from "../../../events/Events";

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
   const { rememberScroll, getScroll } = useRememberScroll();
   const [scroll, setScroll] = useState<number>(0);
   const debouncedScroll = useDebounce(100, scroll);
   const { isProductsLoading } = useAppSelector(adminSelector);
   useEffect(() => {
      if (isMasterAuthenticated && layoutRef?.current && !isProductsLoading) {
         //Get remembered scroll
         const remembered = getScroll();

         //If value is present
         if (remembered !== 0) {
            //Scroll it
            layoutRef.current.scrollTo({ behavior: "smooth", top: remembered });
            return;
         }
      }
   }, [layoutRef, isMasterAuthenticated, isProductsLoading]);

   return (
      <div
         ref={layoutRef}
         onScroll={(e: any) => {
            const currScroll = e.target.scrollTop;
            //If master authenticated remember scroll
            if (isMasterAuthenticated) {
               setScroll(currScroll);
               //Remember layout scroll here (that after update master stays same position)
               rememberScroll(debouncedScroll);
               return;
            }
            if (!isCategSet.current) {
               if (catalogRef.current !== null) {
                  fillUpAdj();
                  isCategSet.current = true;
               }
            }
            findClosest(currScroll + approx);
         }}
         className={isWorkerAuthenticated ? "layout --no-overflow" : "layout"}>
         <LayoutContext.Provider
            value={{
               layoutRef
            }}>
            <Header />

            {isWorkerAuthenticated || isMasterAuthenticated ? null : children}

            {isWorkerAuthenticated && (
               <>
                  <Modals />
                  <Drags />
               </>
            )}
            {isMasterAuthenticated && <AdminAppForm />}
            {routes}
         </LayoutContext.Provider>
      </div>
   );
};

export default Layout;
