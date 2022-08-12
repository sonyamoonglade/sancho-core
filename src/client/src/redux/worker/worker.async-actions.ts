import { AppDispatch } from "../store";
import { AxiosInstance } from "axios";
import { workerActions } from "./worker.slice";
import { ListResponse, OrderStatus } from "../../common/types";
import { BACKEND_URL } from "../../hooks/useAxios";

export const getInitialQueue = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   try {
      const { data } = await client.get("/order/initialQueue");
      dispatch(workerActions.setOrderQueue(data?.queue));
   } catch (e: any) {
      dispatch(workerActions.setError(e.message));
   }
};

export const startEventSourcingForQueue = () => async (dispatch: AppDispatch) => {
   let s: EventSource;
   try {
      s = new EventSource(`${BACKEND_URL}/order/queue`, {
         withCredentials: true
      });
      s.onmessage = function (event) {
         const data = JSON.parse(event.data);
         dispatch(workerActions.setOrderQueue(data?.queue));
      };
      s.onerror = function () {
         setTimeout(() => {
            s.close();
            dispatch(startEventSourcingForQueue());
         }, 1000);
      };

      return s;
   } catch (e) {
      setTimeout(() => {
         s.close();
         dispatch(startEventSourcingForQueue());
      }, 1000);
      alert(e);
   }
};

export const fetchQueryLiveSearchResults = (query: string, client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const { data } = await client.get(`/product/?v=${query}`);
   dispatch(workerActions.overrideProductQueryResults(data.result));
};

export const fetchUserLiveSearchResults = (query: string, client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const { data } = await client.get(`/users/find?v=7${query}`);
   dispatch(workerActions.overrideUserQueryResults(data.result));
};

export const getOrderList = (status: OrderStatus, client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const url = "/order/list";
   const { data } = await client.get<ListResponse>(`${url}?status=${status}`);
   dispatch(workerActions.setOrderList(data));
};
