import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DatabaseCartProduct, OrderQueue, Product, VerifiedQueueOrder, WaitingQueueOrder } from "../../common/types";
import { ListResponse } from "../../../../common/types";

interface WorkerInitialState {
   queryResults: Product[];
   virtualCart: {
      items: DatabaseCartProduct[];
   };
   error: {
      modal: boolean;
      val: string;
   };
   orderQueue: OrderQueue;
   orderList: {
      complete: VerifiedQueueOrder[];
      cancel: VerifiedQueueOrder[];
   };
}

const initialState: WorkerInitialState = {
   queryResults: null,
   error: {
      val: "",
      modal: false
   },
   orderQueue: null,
   virtualCart: {
      items: []
   },
   orderList: {
      complete: [],
      cancel: []
   }
};

const workerSlice = createSlice({
   initialState,
   name: "worker",
   reducers: {
      setOrderList: function (s, a: PayloadAction<ListResponse>) {
         s.orderList = a?.payload || {
            complete: [],
            cancel: []
         };
      },
      overrideQueryResults: function (s, a: PayloadAction<Product[]>) {
         s.queryResults = a.payload;
      },

      setError: function (s, a: PayloadAction<string>) {
         s.error.val = a.payload;
      },
      toggleErrorModal: function (s, a: PayloadAction<boolean>) {
         s.error.modal = a?.payload || !s.error.modal;
      },
      setOrderQueue: function (s, a: PayloadAction<OrderQueue>) {
         s.orderQueue = a.payload;
      },
      setVirtualCart: function (s, a: PayloadAction<DatabaseCartProduct[]>) {
         s.virtualCart.items = a.payload;
      }
   }
});

export default workerSlice.reducer;
export const workerActions = workerSlice.actions;
