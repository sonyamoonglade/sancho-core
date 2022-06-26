import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerSelector } from "../../../../redux";
import { GrFormClose } from "react-icons/gr";
import OrderHistoryItem, { ExtraData } from "../../../orderHistory/OrderHistoryItem";
import "../order-list.styles.scss";
import { getOrderList } from "../../../../redux/worker/worker.async-actions";
import { OrderStatus } from "../../../../common/types";
import { useAxios } from "../../../../hooks/useAxios";
const CancelList = () => {
   const { worker } = useAppSelector(windowSelector);
   const { orderList } = useAppSelector(workerSelector);
   const client = useAxios();
   const dispatch = useAppDispatch();
   function handleListClose() {
      dispatch(windowActions.toggleCancelList(false));
   }
   useEffect(() => {
      dispatch(getOrderList(OrderStatus.cancelled, client));
   }, [worker.cancelList]);

   return (
      <div className={worker.cancelList ? "order_list cancel --olist-open" : "order_list cancel"}>
         <p className="list_title">Отмененные заказы</p>
         <GrFormClose onClick={handleListClose} size={35} className="order_list_back_icon" />
         <ul>
            {orderList.cancel?.map((order) => {
               const extraData: ExtraData = {
                  phoneNumber: order.phone_number,
                  verifiedFullname: order.verified_fullname
               };
               return <OrderHistoryItem key={order.id + order.status} order={order} isFirstOrder={false} extraData={extraData} canDrag={false} />;
            })}
         </ul>
      </div>
   );
};

export default CancelList;
