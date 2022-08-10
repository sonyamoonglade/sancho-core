import axios, { AxiosError, AxiosInstance } from "axios";
import { useAppDispatch, useAppSelector, userSelector, userSlice, workerActions } from "../redux";

let BACKEND_URL = "/api";
if (process.env.NODE_ENV === "production") {
   BACKEND_URL = "/api";
}
console.log(BACKEND_URL, "backend url");
let instance: AxiosInstance;
export function useAxios() {
   const userActions = userSlice.actions;
   const { isWorkerAuthenticated } = useAppSelector(userSelector);
   const dispatch = useAppDispatch();
   if (instance !== undefined) {
      return instance;
   }
   async function responseErrorHandler(error: AxiosError) {
      const statusCode = error.response.status;
      //Proceed unauthorized
      if (statusCode === 401) {
         dispatch(userActions.logout());
         dispatch(userActions.logoutWorker());
         dispatch(userActions.logoutMaster());
         return;
      }

      if (statusCode === 500) {
         return Promise.reject(error);
      }
      const responseData: any = error.response.data;
      let errMSg = responseData?.message || "Непредвиденная ошибка сервера!";
      //If requested for check
      if (error.request.responseType === "blob") {
         //get text from bytes
         const text: any = await (responseData as Blob).text();
         //read json
         errMSg = JSON.parse(text).message;
      }
      if (isWorkerAuthenticated) {
         dispatch(workerActions.setError(errMSg));
         dispatch(workerActions.toggleErrorModal(true));
      }
      return Promise.reject(error);
   }
   function responseSuccessHandler(s: any) {
      return s;
   }

   const client = axios.create({
      baseURL: BACKEND_URL,
      withCredentials: true
   });

   client.interceptors.response.use(
      (success) => responseSuccessHandler(success),
      (error) => responseErrorHandler(error)
   );

   return client;
}
