import React, { FC, useEffect } from "react";
import { OrderStatus, ResponseUserOrder } from "../../common/types";
import { currency } from "../../common/constants";
import { BiShoppingBag } from "react-icons/bi";
import { useCorrectOrderData } from "./hooks/useCorrectOrderData";
import { CgCloseO } from "react-icons/cg";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import { orderSelector, useAppSelector } from "../../redux";

interface orderHistoryItemProps {
   order: ResponseUserOrder;
   isFirstOrder: boolean;
   extraData?: any;
}

const OrderHistoryItem: FC<orderHistoryItemProps> = ({ order, isFirstOrder, extraData }) => {
   const { orderHistory } = useAppSelector(orderSelector);
   const { cid, cstatus, cdate, cddate, correctData, orderItemCorrespondingClassName } = useCorrectOrderData(order);

   const { onEnd, onMove, cancelIconAnimationRef, animationRef, x } = useCancelOrder(order);

   useEffect(() => {
      correctData();
   }, [orderHistory]);

   return (
      <>
         <li
            style={{ transform: `translateX(${x}px)` }}
            onTouchMove={(e) => onMove(e)}
            onTouchEnd={(e) => onEnd()}
            ref={animationRef}
            className={orderItemCorrespondingClassName}>
            <div className="top">
               <div className="top_left">
                  <strong style={{ fontFamily: "Geometria" }}>#</strong>
                  <p className="id">{cid}</p>
                  <p>|&nbsp;</p>
                  <p className="order_status">{cstatus}</p>
                  {extraData?.phoneNumber !== undefined && (
                     <>
                        <p>&nbsp;|&nbsp;</p>
                        <p className="phone_number">+{extraData.phoneNumber.substring(2, extraData.phoneNumber.length)}</p>
                     </>
                  )}
                  {extraData?.verifiedFullname !== undefined && (
                     <>
                        <p>&nbsp;|&nbsp;</p>
                        <p className="order_status">{extraData.verifiedFullname}</p>
                     </>
                  )}
               </div>
               <p className="total_order_price">
                  {order.total_cart_price} {currency}
               </p>
            </div>
            <div className="bottom">
               <div className="bottom_first_row">
                  <div className="first_row_left">
                     <p className="creation_pre">Оформлен:</p>
                     <p className="creation_date">в {cdate}</p>
                  </div>
               </div>
               <div className="bottom_second_row">
                  <div className="second_row_left">
                     <p className="creation_pre">Доставка:</p>
                     <p className="creation_date delivery_date">
                        {order.is_delivered && !order.is_delivered_asap && order.status === OrderStatus.waiting_for_verification
                           ? `скажу по телефону`
                           : order.status === OrderStatus.cancelled
                           ? "заказ отменен"
                           : order.is_delivered && !order.is_delivered_asap
                           ? `к ${cddate}`
                           : order.is_delivered_asap && order.is_delivered
                           ? "как можно скорее"
                           : "самовывоз"}
                     </p>
                  </div>
                  {order.status !== OrderStatus.cancelled && <div className="green_dot">&nbsp;</div>}
                  <BiShoppingBag size={25} />
               </div>
            </div>
         </li>
         {isFirstOrder && (
            <div className="delete_layer">
               <span ref={cancelIconAnimationRef}>
                  <CgCloseO className="delete_icon" size={30} color={"white"} />
               </span>
            </div>
         )}
      </>
   );
};

export default React.memo(OrderHistoryItem);
