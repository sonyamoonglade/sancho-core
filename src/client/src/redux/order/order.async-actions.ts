import {AppDispatch} from "../store";
import {AxiosInstance} from "axios";
import {orderActions} from "./order.slice";
import {ResponseUserOrder} from "../../common/types";
import {USER_CANCEL_EXPLANATION} from "../../common/constants";

type userOrderHistoryResponse = {
    hasMore: boolean
    orders: ResponseUserOrder[]
}

export const getOrderHistory = (client: AxiosInstance, to: number) => async (dispatch: AppDispatch) => {
    function sortFuncByStatus(a:ResponseUserOrder,b:ResponseUserOrder) {
        return b.status.length - a.status.length
    }
    try{
        dispatch(orderActions.setIsFetching(true))
        const {data} = await client.get<userOrderHistoryResponse>(`/order/userOrderHistory?to=${to.toString()}`)

        const sortedOrders = data.orders.sort(sortFuncByStatus)
        dispatch(orderActions.addManyAndSetHasMore({...data,orders:sortedOrders}))
        dispatch(orderActions.setIsFetching(false))


    }catch (e: any) {
        dispatch(orderActions.setIsFetching(false))
        return Promise.reject(e.message)
    }

}

export const cancelOrder = (client:AxiosInstance, orderId: number) => async (dispatch: AppDispatch) => {

    try {
        const cancel_explanation = USER_CANCEL_EXPLANATION
        const body = {
            order_id: orderId,
            cancel_explanation
        }

        await client.put("order/cancelOrder", body)
        dispatch(orderActions.cancelById(orderId))
    }catch (e: any) {
        console.log(e)
        return Promise.reject(e.message)
    }



}