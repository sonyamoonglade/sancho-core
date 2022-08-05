import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminProduct } from "../../types/types";

interface AdminState {
   selectedProduct: AdminProduct;
   isProductsLoading: boolean;
}

const initialState: AdminState = {
   selectedProduct: null,
   isProductsLoading: true
};

export const adminSlice = createSlice({
   initialState,
   name: "admin",
   reducers: {
      selectProduct: function (s, a: PayloadAction<AdminProduct>) {
         s.selectedProduct = a?.payload;
      },
      setIsProductsLoading: function (s, a: PayloadAction<boolean>) {
         s.isProductsLoading = a?.payload;
      }
   }
});
export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
