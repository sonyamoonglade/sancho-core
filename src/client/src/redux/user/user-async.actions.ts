import { AxiosInstance } from "axios";
import { AppDispatch } from "../store";
import { userActions } from "./user.slice";
import { AppRoles } from "../../common/types";

export const authMe = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const r = await client.get(`/users/auth/me`);

   if (r && r.status === 200 && r.data.phone_number !== undefined && r.data.role === undefined) {
      return dispatch(userActions.login(r.data));
   }
   if (r && r.data.role === AppRoles.worker) {
      return dispatch(userActions.loginWorker());
   }
   if (r && r.data.role === AppRoles.master) {
      return dispatch(userActions.loginMaster());
   }
};

export const logout = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const r = await client.get("/users/logout");
   if (r.status === 200) {
      dispatch(userActions.logoutMaster());
      dispatch(userActions.logoutWorker());
   } else {
      return;
   }
};
