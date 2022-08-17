import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminProduct } from "../../types/types";
import { MasterUser, RunnerUser } from "../../common/types";

interface AdminState {
   selectedProduct: AdminProduct;
   isProductsLoading: boolean;
   users: {
      workers: MasterUser[];
      runners: RunnerUser[];
   };
}

const initialState: AdminState = {
   selectedProduct: null,
   isProductsLoading: true,
   users: {
      runners: [],
      workers: []
   }
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
      },
      setRunners: function (s, a: PayloadAction<RunnerUser[]>) {
         s.users.runners = a?.payload;
      },
      setWorkers: function (s, a: PayloadAction<MasterUser[]>) {
         s.users.workers = a?.payload;
      },
      appendRunner: function (s, a: PayloadAction<RunnerUser>) {
         s.users.runners = s.users.runners.concat(a?.payload);
      },
      appendWorker: function (s, a: PayloadAction<MasterUser>) {
         s.users.workers = s.users.workers.concat(a?.payload);
      }
   }
});
export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
