import { AxiosInstance } from "axios";
import { AppDispatch } from "../store";
import { userActions } from "./user.slice";

export const authMe = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   const r = await client.get(`/users/auth/me`);
   if (r.status === 200 && r.data.phone_number !== undefined) {
      return dispatch(userActions.login(r.data.phone_number));
   } else if (r.status === 200) {
      return dispatch(userActions.loginMaster());
   }
};
