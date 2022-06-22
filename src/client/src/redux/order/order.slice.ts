import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderStatus, ResponseUserOrder } from "../../common/types";

interface InitialOrderStateInterface {
   orderHistory: ResponseUserOrder[];
   hasMore: boolean;
   isFetching: boolean;
}

const initialState: InitialOrderStateInterface = {
   orderHistory: [],
   hasMore: true,
   isFetching: false
};

export const orderSlice = createSlice({
   name: "order",
   initialState,
   reducers: {
      //todo: add infinite scroll from async action.. smth like that
      addOne: (s, a: PayloadAction<ResponseUserOrder>) => {
         const o = a.payload;
         s.orderHistory = s.orderHistory.concat(o);
      },
      addManyAndSetHasMore: (s, a: PayloadAction<{ orders: ResponseUserOrder[] }>) => {
         const { orders } = a.payload;
         s.orderHistory = orders;
      },
      setIsFetching: (s, a: PayloadAction<boolean>) => {
         s.isFetching = a.payload;
      },
      cancelById: (s, a: PayloadAction<number>) => {
         const order_id = a.payload;

         s.orderHistory = s.orderHistory.map((o) => {
            if (o.id === order_id) {
               o.status = OrderStatus.cancelled;
               return o;
            }

            return o;
         });
      }
   }
});

export default orderSlice.reducer;
export const orderActions = orderSlice.actions;
