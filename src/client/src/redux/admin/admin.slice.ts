import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminProduct } from "../../common/types";

interface AdminState {
   selectedProduct: AdminProduct;
}

const initialState: AdminState = {
   selectedProduct: null
};

export const adminSlice = createSlice({
   initialState,
   name: "admin",
   reducers: {
      selectProduct: function (s, a: PayloadAction<AdminProduct>) {
         s.selectedProduct = a?.payload;
      }
   }
});
export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
