import { AppDispatch } from "../store";
import { AxiosInstance } from "axios";
import { orderActions } from "./order.slice";
import { ResponseUserOrder } from "../../common/types";
import { USER_CANCEL_EXPLANATION } from "../../common/constants";

type userOrderHistoryResponse = {
   orders: ResponseUserOrder[];
};

export const getOrderHistory = (client: AxiosInstance, to: number) => async (dispatch: AppDispatch) => {
   try {
      dispatch(orderActions.setIsFetching(true));
      const { data } = await client.get<userOrderHistoryResponse>(`/order/userOrderHistory?to=${to.toString()}`);

      dispatch(orderActions.addManyAndSetHasMore(data));
      dispatch(orderActions.setIsFetching(false));
   } catch (e: any) {
      dispatch(orderActions.setIsFetching(false));
      return Promise.reject(e.message);
   }
};

export const cancelOrder = (client: AxiosInstance, orderId: number, phoneNumber: string) => async (dispatch: AppDispatch) => {
   try {
      const uce = USER_CANCEL_EXPLANATION;
      const body = {
         order_id: orderId,
         cancel_explanation: `${uce} `
      };

      await client.put("order/cancel", body);
      dispatch(orderActions.cancelById(orderId));
   } catch (e: any) {
      return Promise.reject(e.message);
   }
};
