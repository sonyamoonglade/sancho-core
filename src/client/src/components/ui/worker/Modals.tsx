import React from "react";
import VerifyOrderModal from "../../worker/modal/verifyOrder/VerifyOrderModal";
import CreateOrderModal from "../../worker/modal/createOrder/CreateOrderModal";
import CancelOrderModal from "../../worker/modal/cancelOrder/CancelOrderModal";
import CompleteOrderModal from "../../worker/modal/completeOrder/CompleteOrderModal";
import WorkerAppForm from "../../worker/workerAppForm/WorkerAppForm";
import MarkList from "../../worker/markList/MarkList";
import MarkModal from "../../worker/modal/mark/MarkModal";
import DetailsModal from "../../worker/modal/details/DetailsModal";
import { useAppSelector, workerSelector } from "../../../redux";
import VirtualCart from "../../worker/virtualCart/VirtualCart";

const Modals = () => {
   const { detailedOrder } = useAppSelector(workerSelector);
   return (
      <>
         <VerifyOrderModal />
         <CreateOrderModal />

         <CancelOrderModal />
         <CompleteOrderModal />
         <WorkerAppForm />
         <MarkList />
         <MarkModal />
         {detailedOrder && <DetailsModal />}
      </>
   );
};

export default Modals;
