import React, { useEffect } from "react";
import "./order-history.styles.scss";
import { getOrderHistory, orderSelector, useAppDispatch, useAppSelector, userSelector, windowActions, windowSelector } from "../../redux";
import { useAxios } from "../../hooks/useAxios";
import OrderHistoryItem from "./OrderHistoryItem";
import { ResponseUserOrder } from "../../common/types";
import { TiArrowBack } from "react-icons/ti";

const OrderHistory = () => {
   const client = useAxios();

   const dispatch = useAppDispatch();
   const { orderHistory, isFetching } = useAppSelector(orderSelector);
   const { isAuthenticated } = useAppSelector(userSelector);
   const { orderHistory: orderHistoryModal } = useAppSelector(windowSelector);

   useEffect(() => {
      if (!isAuthenticated) {
         return;
      }
      if (orderHistoryModal) {
         try {
            dispatch(getOrderHistory(client, 10));
         } catch (e: any) {
            console.log(e);
         }
      }
   }, [isAuthenticated, orderHistoryModal]);

   function toggleOrderHistory() {
      dispatch(windowActions.toggleOrderHistory());
   }

   return (
      <div className={orderHistoryModal ? "order_h modal modal--visible" : "order_h modal"}>
         <div className="order_h_header">
            <TiArrowBack onClick={() => toggleOrderHistory()} className="cart_back_icon" size={30} />
            <p>Ваши заказы</p>
         </div>
         <ul className="order_h_list">
            {orderHistory &&
               !isFetching &&
               orderHistory.map((o: ResponseUserOrder, i: number) => {
                  if (i === 0) return <OrderHistoryItem isFirstOrder={true} key={o.id} order={o} />;
                  return <OrderHistoryItem isFirstOrder={false} key={o.id} order={o} />;
               })}
            {isFetching && <p>Загружаем ваши заказы...</p>}
         </ul>
      </div>
   );
};

export default React.memo(OrderHistory);
