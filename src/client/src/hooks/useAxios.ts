import axios, { AxiosError, AxiosInstance } from "axios";
import { useAppDispatch, userSlice, workerActions } from "../redux";

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// todo: use nginx
if (!BACKEND_URL) {
   BACKEND_URL = "https://zharpizza-backend.herokuapp.com/api/v1";
}
let instance: AxiosInstance;
export function useAxios() {
   const userActions = userSlice.actions;

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
      fetch("http://localhost:5000/api/v1/order/createMasterOrder", {
         headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6",
            "content-type": "application/json",
            "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            cookie: "Webstorm-5b278a07=d96d20b2-164d-4fa6-9327-b73bf4451f24; SID=85b69ed55fc7856bc4723b593b1d7e1790b7cb2bc0c0b8093c7d0fb0f2d4746b",
            Referer: "http://localhost:3000/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
         },
         body: "{}",
         method: "POST"
      });

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
      dispatch(workerActions.setError(errMSg));
      dispatch(workerActions.toggleErrorModal(true));
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
