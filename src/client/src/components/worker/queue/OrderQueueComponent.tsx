import React, { useEffect } from "react";
import { useAxios } from "../../../hooks/useAxios";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss";
import { useAppDispatch, useAppSelector, workerSelector } from "../../../redux";
import { getInitialQueue, startEventSourcingForQueue } from "../../../redux/worker/worker.async-actions";
import Error from "../error/Error";
import CompleteList from "../orderList/complete/CompleteList";
import CancelList from "../orderList/cancel/CancelList";

const OrderQueueComponent = () => {
   const client = useAxios();
   const { orderQueue: queue } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(getInitialQueue(client));
      dispatch(startEventSourcingForQueue());
   }, []);

   useEffect(() => {
      document.body.style.overflowY = "hidden";
      return () => {
         document.body.style.overflowY = "visible";
      };
   }, []);

   return (
      <div className="queue_container">
         <div className="waiting queue_col">
            <ul>
               {queue?.waiting.map((qitem) => (
                  <OrderHistoryItem
                     extraData={{
                        phoneNumber: qitem.user.phone_number
                     }}
                     key={qitem.id}
                     order={qitem}
                     isFirstOrder={false}
                  />
               ))}
            </ul>
         </div>
         <Error />
         <CompleteList />
         <CancelList />
         <div className="verified queue_col">
            <ul>
               {queue?.verified.map((qitem) => (
                  <OrderHistoryItem
                     extraData={{
                        username: qitem.user.name,
                        phoneNumber: qitem.user.phone_number
                     }}
                     key={qitem.id}
                     order={qitem}
                     isFirstOrder={false}
                  />
               ))}
            </ul>
         </div>
      </div>
   );
};

export default React.memo(OrderQueueComponent);
