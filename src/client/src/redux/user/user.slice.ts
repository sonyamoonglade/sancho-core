import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerUser, DeliveryDetails } from "../../common/types";

interface UserState {
   isAuthenticated: boolean;
   isWorkerAuthenticated: boolean;
   isMasterAuthenticated: boolean;
}

const initialState: UserState = {
   isAuthenticated: false,
   isWorkerAuthenticated: false,
   isMasterAuthenticated: false
};

export const userSlice = createSlice({
   initialState,
   name: "user",
   reducers: {
      login: (s, a: PayloadAction<CustomerUser>) => {
         s.isAuthenticated = true;
      },
      logout: (s) => {
         s.isAuthenticated = false;
      },
      loginWorker: (s) => {
         s.isWorkerAuthenticated = true;
      },
      logoutWorker: (s) => {
         s.isWorkerAuthenticated = false;
      },
      loginMaster: function (s) {
         s.isMasterAuthenticated = true;
      },
      logoutMaster: function (s) {
         s.isMasterAuthenticated = false;
      }
   }
});
export const userActions = userSlice.actions;
export default userSlice.reducer;
