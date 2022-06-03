import React, {FC, LegacyRef, useEffect, useRef, useState} from 'react';
import {ResponseUserOrder} from "../../common/types";
import {currency} from "../../common/constants";
import {BiShoppingBag} from "react-icons/bi";
import {useCorrectOrderData} from "./hooks/useCorrectOrderData";
import {CgCloseO} from 'react-icons/cg'
import {useCancelOrder} from "../../hooks/useCancelOrder";
import EventEmitter from "events";
import {EventTypes} from "../../types/types";
import {orderSelector, useAppSelector} from "../../redux";

interface orderHistoryItemProps {
    order: ResponseUserOrder
    isFirstOrder: boolean
}

const OrderHistoryItem:FC<orderHistoryItemProps> = ({order,isFirstOrder}) => {

    const {orderHistory} = useAppSelector(orderSelector)
    console.log("render")

    const {
        cid,
        cstatus,
        cdate,
        correctData,
        orderItemCorrespondingClassName
    } = useCorrectOrderData(order)

    const {
        onEnd,
        onMove,
        cancelIconAnimationRef,
        animationRef,
        x
    } = useCancelOrder(order)

    useEffect(() => {
       correctData()
    },[orderHistory])




    return (
        <>
            <li
                style={{transform:`translateX(${x}px)`}}
                onTouchMove={(e) => onMove(e)}
                onTouchEnd={(e) => onEnd()}
                ref={animationRef}
                className={orderItemCorrespondingClassName}
            >
                <div className="top">
                    <div className='top_left'>
                        <p className="id"><strong style={{fontFamily:"Geometria"}}>#</strong>{cid} <strong>|</strong></p>
                        <p className="order_status">{cstatus}</p>
                    </div>


                    <p className='total_order_price'>{order.total_cart_price} {currency}</p>
                </div>
                <div className="bottom">
                    <div className="bottom_left">
                        <p className='creation_pre'>Оформлен:</p>
                        <p className='creation_date'>
                            {cdate}
                            <strong> |</strong>
                            <strong style={{fontFamily:"Geometria"}}>
                                {order.is_delivered ? " Доставка" : " Самовывоз"}
                            </strong>
                        </p>
                    </div>
                    <span>
                    <div className='green_dot'>&nbsp;</div>
                    <BiShoppingBag className='cart_button' size={25} />
                </span>


                </div>

            </li>
            {isFirstOrder &&
                <div className='delete_layer'>
                    <span ref={cancelIconAnimationRef}>
                        <CgCloseO className='delete_icon' size={30} color={"white"} />
                    </span>
                </div>
            }
        </>
    );
};

export default React.memo(OrderHistoryItem);