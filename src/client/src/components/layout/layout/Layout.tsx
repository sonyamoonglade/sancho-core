import React, { FC } from "react";

import "./layout.styles.scss";
import "../../worker/worker-globals.scss";

import Header from "../header/Header";
import { useRoutes } from "../../../hooks/useRoutes";
import { useAppSelector, userSelector, windowSelector } from "../../../redux";
import WorkerAppForm from "../../worker/workerAppForm/WorkerAppForm";
import CreateOrderModal from "../../worker/modal/createOrder/CreateOrderModal";
import VerifyOrderModal from "../../worker/modal/verifyOrder/VerifyOrderModal";
import CancelOrderModal from "../../worker/modal/cancelOrder/CancelOrderModal";
import CompleteOrderDrag from "../../worker/drag/complete/CompleteOrderDrag";
import CancelOrderDrag from "../../worker/drag/cancel/CancelOrderDrag";
import VerifyOrderDrag from "../../worker/drag/verify/VerifyOrderDrag";

interface layoutProps {
   children: any;
}

const Layout: FC<layoutProps> = ({ children }) => {
   const { isMasterAuthenticated } = useAppSelector(userSelector);
   const routes = useRoutes(isMasterAuthenticated);
   return (
      <div className={isMasterAuthenticated ? "layout --no-overflow" : "layout"}>
         <Header />

         {isMasterAuthenticated ? null : children}

         {routes}

         {isMasterAuthenticated && (
            <>
               <>
                  <VerifyOrderModal />
                  <CreateOrderModal />
                  <CancelOrderModal />
                  <WorkerAppForm />
               </>
               <>
                  <CompleteOrderDrag />
                  <CancelOrderDrag />
                  <VerifyOrderDrag />
               </>
            </>
         )}
      </div>
   );
};

export default Layout;
