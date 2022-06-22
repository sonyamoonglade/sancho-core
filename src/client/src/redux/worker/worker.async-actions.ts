import { AppDispatch } from "../store";
import { AxiosInstance } from "axios";
import { workerActions } from "./worker.slice";

export const getInitialQueue = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   try {
      const { data } = await client.get("/order/initialQueue");
      dispatch(workerActions.setOrderQueue(data?.queue));
   } catch (e: any) {
      dispatch(workerActions.setError(e.message));
   }
};

export const startEventSourcingForQueue = () => async (dispatch: AppDispatch) => {
   try {
      const s: EventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/order/queue`, {
         withCredentials: true
      });
      s.onmessage = function (event) {
         const data = JSON.parse(event.data);
         dispatch(workerActions.setOrderQueue(data?.queue));
      };
      s.onerror = function () {
         s.close();
      };
      return s;
   } catch (e) {
      alert(e);
   }
};

export const fetchQueryLiveSearchResults = (query: string, client: AxiosInstance) => async (dispatch: AppDispatch) => {
   try {
      const { data } = await client.get(`/product/?query=${query}`);
      dispatch(workerActions.overrideResults(data.result));
   } catch (e: any) {
      dispatch(workerActions.setError(e.message));
   }
};
