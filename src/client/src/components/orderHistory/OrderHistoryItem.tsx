import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { OrderStatus, ResponseUserOrder, VerifiedQueueOrder } from "../../common/types";
import { currency } from "../../common/constants";
import { BiShoppingBag } from "react-icons/bi";
import { useCorrectOrderData } from "./hooks/useCorrectOrderData";
import { CgCloseO } from "react-icons/cg";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import {
   cancelOrder, cancelOrderWithoutPhone,
   orderSelector,
   useAppDispatch,
   useAppSelector,
   userSelector,
   windowActions,
   windowSelector,
   workerActions
} from "../../redux";
import { AppResponsiveState } from "../../types/types";
import { useDrag } from "react-dnd";
import { useNotifyRunner } from "../../hooks/useNotifyRunner";
import { useAxios } from "../../hooks/useAxios";

export interface ExtraData {
   phoneNumber?: string;
   username?: string;
}

interface orderHistoryItemProps {
   order: ResponseUserOrder;
   isFirstOrder: boolean;
   extraData?: ExtraData;
   canDrag?: boolean;
}
export interface Droppable {
   phoneNumber: string;
   id: number;
   status: string;
}

interface DropResult {
   zone: string;
}

export enum DropZones {
   COMPLETE = "complete",
   VERIFY = "verify",
   CANCEL = "cancel"
}

const OrderHistoryItem: FC<orderHistoryItemProps> = ({ order, isFirstOrder, extraData}) => {
   const { orderHistory } = useAppSelector(orderSelector);
   const { cid, cstatus, cdate, cddate, correctData, orderItemCorrespondingClassName } = useCorrectOrderData(order);
   const { isWorkerAuthenticated } = useAppSelector(userSelector);
   const { onEnd, onMove, cancelIconAnimationRef, animationRef, x } = useCancelOrder(order);
   const { appResponsiveState } = useAppSelector(windowSelector);
   const { notify } = useNotifyRunner();
   const dispatch = useAppDispatch();
   const client = useAxios()

   const isNotifiedCondition = order.status === OrderStatus.verified && (order as unknown as VerifiedQueueOrder).isRunnerNotified;

   useEffect(() => {
      correctData();
   }, [orderHistory]);

   const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
      type: "ORDER",
      item: {
         id: order.id,
         phoneNumber: extraData?.phoneNumber || "",
         status: order.status
      },
      collect: (monitor) => ({
         isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
         const dropResult: DropResult = monitor.getDropResult();
         if (item && dropResult) {
            handleDrop(dropResult.zone, item);
         }
      }
   }));

   function handleDrop(dropzone: string, item: Droppable) {
      dispatch(windowActions.setDropItem(item));
      switch (dropzone) {
         case DropZones.CANCEL:
            if (item.status === OrderStatus.completed || item.status === OrderStatus.cancelled) {
               return;
            }
            dispatch(windowActions.toggleCancelOrder());
            break;
         case DropZones.VERIFY:
            if (item.status !== OrderStatus.waiting_for_verification) {
               return;
            }
            dispatch(windowActions.toggleVerifyOrder());
            break;
         case DropZones.COMPLETE:
            if (item.status !== OrderStatus.verified) {
               return;
            }
            dispatch(windowActions.toggleCompleteOrder());
      }
   }

   //Func only for workers so can cast type because orders from queue
   function toggleDetails() {
      dispatch(windowActions.toggleDetails());
      dispatch(workerActions.setDetailedOrder(order as VerifiedQueueOrder));
   }

   async function handleNotifyRunner() {
      //Check if verified (to cast without errors) and check if already notified
      if (isNotifiedCondition) {
         return;
      }
      await notify(order.id);
   }

   const [isHovering, setIsHovering] = useState<boolean>(false);
   const hoverRef = useRef<HTMLDivElement>(null);
   function hoverHandler(e: any) {
      if (hoverRef.current === null) {
         return;
      }
      if (isWorkerAuthenticated || appResponsiveState !== AppResponsiveState.computer) {
         return;
      }
      if (isHovering) {
         hoverRef.current.style.opacity = "0";
         setIsHovering(false);
         return;
      }

      hoverRef.current.style.opacity = "1";
      setIsHovering(true);
   }

   const correctRef = useMemo(() => {
      if (!isWorkerAuthenticated && appResponsiveState !== AppResponsiveState.computer) {
         return animationRef;
      }

      return drag;
   }, [appResponsiveState, animationRef, isWorkerAuthenticated, drag]);

   function cancelOrderHandler(){
      dispatch(cancelOrderWithoutPhone(client, order.id))
   }

   return (
      <div ref={dragPreview}>
         <li
            onMouseEnter={hoverHandler}
            onMouseLeave={hoverHandler}
            role="Handle"
            style={{ transform: `translateX(${x}px)`, opacity: isDragging ? 0.4 : 1 }}
            onTouchMove={(e) => onMove(e)}
            onTouchEnd={onEnd}
            ref={correctRef}
            className={orderItemCorrespondingClassName}>
            {!isWorkerAuthenticated && order.status === OrderStatus.waiting_for_verification && appResponsiveState === AppResponsiveState.computer && (
               <div onClick={cancelOrderHandler} className="cancel_pc_button" ref={hoverRef}>
                  <p>Отменить заказ</p>
               </div>
            )}
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
                  {extraData?.username !== undefined && (
                     <>
                        <p>&nbsp;|&nbsp;</p>
                        <p className="order_status username">{extraData.username}</p>
                     </>
                  )}
               </div>
               <p className="total_order_price">
                  {order.amount} {currency}
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
                  {isWorkerAuthenticated && (
                     <div className="second_row_right">
                        <span>
                           {order.status === OrderStatus.verified && (
                              <button className="pay_btn details">
                                 <p onClick={toggleDetails}>Детали</p>
                              </button>
                           )}
                           {order.status === OrderStatus.verified && order.is_delivered && (
                              <button
                                 onClick={handleNotifyRunner}
                                 className={isNotifiedCondition ? "pay_btn details --green" : "pay_btn details"}>
                                 <p>{isNotifiedCondition ? "Курьер уведомлен!" : "Уведомить курьера"}</p>
                              </button>
                           )}
                        </span>
                     </div>
                  )}

                  {order.status !== OrderStatus.cancelled && order.status !== OrderStatus.completed && (
                     <div className="green_dot">&nbsp;</div>
                  )}
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
      </div>
   );
};

export default React.memo(OrderHistoryItem);
