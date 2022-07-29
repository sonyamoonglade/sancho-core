import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerUser, DeliveryDetails } from "../../common/types";

interface UserState {
   isAuthenticated: boolean;
   phoneNumber: string;
   username: string;
   delivery_details: DeliveryDetails;
   isWorkerAuthenticated: boolean;
   isMasterAuthenticated: boolean;
}

const initialState: UserState = {
   isAuthenticated: false,
   username: "",
   phoneNumber: "",
   delivery_details: null,
   isWorkerAuthenticated: false,
   isMasterAuthenticated: false
};

export const userSlice = createSlice({
   initialState,
   name: "user",
   reducers: {
      login: (s, a: PayloadAction<CustomerUser>) => {
         s.phoneNumber = a.payload.phone_number;
         s.isAuthenticated = true;
         s.delivery_details = a.payload?.delivery_details || null;
         s.username = a.payload?.username;
      },
      logout: (s) => {
         s.isAuthenticated = false;
         s.phoneNumber = "";
         s.delivery_details = null;
         s.username = "";
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
