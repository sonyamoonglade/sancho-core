import {DatabaseCartProduct, OrderQueue, WaitingQueueOrder} from "../../../../common/types";
import {AxiosInstance} from "axios";
import {useAppDispatch, windowActions} from "../../../../redux";
import {useCallback} from "react";

export function useVerifyOrder (client:AxiosInstance,orderQueue: OrderQueue,totalOrderPrice: number, vcart: DatabaseCartProduct[]) {

    const dispatch = useAppDispatch()


    const verifyOrder = useCallback(async function(body: any, phoneNumber: string){
        const order = findWaitingOrderByPhoneNumber(phoneNumber)
        if(order?.total_cart_price !== totalOrderPrice){
            body.cart = vcart
        }
        try {
            await client.put("order/verify", body)
            dispatch(windowActions.toggleVerifyOrder())
        }catch (e) {
            console.log(e)
            alert(e)
        }
    },[vcart,totalOrderPrice,orderQueue])


    function findWaitingOrderByPhoneNumber(phoneNumber: string): WaitingQueueOrder | undefined{
        const order = orderQueue?.waiting.find(o => {
            if(o.phone_number === `+7${phoneNumber}`){
                return o
            }
            return undefined
        })
        return order
    }

    const getOrderTotalPrice = useCallback(function (){
        return vcart.reduce((a,c) => {
            a += c.price * c.quantity
            return a
        },0)
    },[vcart])

    return {getOrderTotalPrice, verifyOrder, findWaitingOrderByPhoneNumber}

}