import React from "react";
import { useAppSelector, windowSelector } from "../../../../redux";

const DetailsModal = () => {
   const { worker } = useAppSelector(windowSelector);
   return (
      <div className={worker.details ? "details worker_modal --w-opened" : "details worker_modal"}>
         <p className="modal_title">Детали заказа</p>
      </div>
   );
};

export default DetailsModal;
