import { AxiosInstance } from "axios";
import { useAppDispatch, userActions } from "../redux";
import { MasterFormValues } from "../components/masterLogin/MasterLogin";
import { AppRoles, CustomerUser } from "../common/types";

export function useAuthentication(client: AxiosInstance) {
   const dispatch = useAppDispatch();

   async function login(phone_number: string) {
      try {
         const body = {
            phone_number
         };
         const r = await client.post(`/users/login`, body);
         if (r.status === 200 || r.status === 201) {
            const data: CustomerUser = {
               username: "",
               delivery_details: null,
               phone_number
            };
            return dispatch(userActions.login(data));
         }
         return dispatch(userActions.logout());
      } catch (e) {
         dispatch(userActions.logout());
         throw e;
      }
   }

   async function loginMaster(formValues: MasterFormValues): Promise<string> {
      try {
         const body = formValues;
         const r = await client.post("/users/loginMaster", body);
         if (r.status === 200) {
            switch (r.data.role) {
               case AppRoles.master:
                  dispatch(userActions.loginMaster());
                  return r.data.role;
               case AppRoles.worker:
                  dispatch(userActions.loginWorker());
                  return r.data.role;
            }
         }
         return null;
      } catch (e) {
         console.log(e);
         dispatch(userActions.logoutMaster());
         throw e;
      }
   }

   return { login, loginMaster };
}
