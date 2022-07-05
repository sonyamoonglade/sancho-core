import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerSelector } from "../../../../redux";
import "../order-list.styles.scss";
import OrderHistoryItem, { ExtraData } from "../../../orderHistory/OrderHistoryItem";
import { getOrderList } from "../../../../redux/worker/worker.async-actions";
import { useAxios } from "../../../../hooks/useAxios";
import { OrderStatus } from "../../../../common/types";
import { GrFormClose } from "react-icons/gr";
const CompleteList = () => {
   const { worker } = useAppSelector(windowSelector);
   const { orderList } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();
   const client = useAxios();
   useEffect(() => {
      dispatch(getOrderList(OrderStatus.completed, client));
   }, [worker.completeList]);

   function handleListClose() {
      dispatch(windowActions.toggleCompleteList(false));
   }
   return (
      <div className={worker.completeList ? "order_list complete --olist-open" : "order_list complete"}>
         <p className="list_title">Приготовленные заказы</p>
         <GrFormClose onClick={handleListClose} size={35} className="order_list_back_icon" />
         <ul>
            {orderList.complete?.map((order) => {
               const extraData: ExtraData = {
                  phoneNumber: order.user.phone_number,
                  username: order.user.name
               };
               return <OrderHistoryItem key={order.id + order.status} order={order} isFirstOrder={false} extraData={extraData} canDrag={false} />;
            })}
         </ul>
      </div>
   );
};

export default CompleteList;
