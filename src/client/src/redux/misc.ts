import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";
import { AxiosInstance } from "axios";

export interface MiscInitialState {
   DELIVERY_PUNISHMENT_VALUE: number;
   DELIVERY_PUNISHMENT_THRESHOLD: number;
}

const initialState: MiscInitialState = {
   DELIVERY_PUNISHMENT_THRESHOLD: null,
   DELIVERY_PUNISHMENT_VALUE: null
};

const placeholders: MiscInitialState = {
   DELIVERY_PUNISHMENT_THRESHOLD: 400,
   DELIVERY_PUNISHMENT_VALUE: 100
};

const misc = createSlice({
   name: "misc",
   initialState,
   reducers: {
      INIT_MISC: function (s, a: PayloadAction<MiscInitialState>) {
         console.log(a);
         s.DELIVERY_PUNISHMENT_VALUE = a.payload.DELIVERY_PUNISHMENT_VALUE;
         s.DELIVERY_PUNISHMENT_THRESHOLD = a.payload.DELIVERY_PUNISHMENT_THRESHOLD;
      }
   }
});

export const fetchMiscData = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   try {
      const { data } = await client.get("/misc");
      console.log(data);
      dispatch(miscActions.INIT_MISC(data.result));
   } catch (e) {
      dispatch(miscActions.INIT_MISC(placeholders));
   }
};

export const miscActions = misc.actions;
export const miscSelector = (state: RootState) => state.miscReducer;

export default misc.reducer;
