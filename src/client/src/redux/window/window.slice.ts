import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppResponsiveState } from "../../types/types";
import { Droppable } from "../../components/orderHistory/OrderHistoryItem";

interface WindowState {
   masterLogin: boolean;
   appResponsiveState: AppResponsiveState;
   navigation: boolean;
   cart: boolean;
   userOrder: boolean;
   loading: boolean;
   loadingSuccess: boolean | null;
   error: boolean;
   errorMessage: string;
   orderHistory: boolean;
   navigationNotification: {
      cart: boolean;
      orders: boolean;
   };
   worker: {
      verifyOrder: boolean;
      createOrder: boolean;
      cancelOrder: boolean;
      virtualCart: boolean;
      completeOrder: boolean;
   };

   drag: {
      item: Droppable;
      dropzone: string;
   };
}

const initialState: WindowState = {
   masterLogin: false,
   appResponsiveState: null,
   navigation: false,
   cart: false,
   userOrder: false,
   loading: false,
   orderHistory: false,
   loadingSuccess: false,
   error: false,
   errorMessage: null,
   navigationNotification: {
      cart: false,
      orders: false
   },
   worker: {
      verifyOrder: false,
      createOrder: false,
      cancelOrder: false,
      virtualCart: false,
      completeOrder: false
   },
   drag: {
      dropzone: "",
      item: {
         id: 0,
         status: "",
         phoneNumber: ""
      }
   }
};

export const windowSlice = createSlice({
   initialState,
   name: "window",
   reducers: {
      toggleCompleteOrder: function (s, a: PayloadAction<boolean>) {
         s.worker.completeOrder = a.payload || !s.worker.completeOrder;
         s.worker.virtualCart = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.verifyOrder = false;
      },
      setDropItem: function (s, a: PayloadAction<Droppable>) {
         s.drag.item = a.payload;
      },
      setResponsiveState: (s, a: PayloadAction<AppResponsiveState>) => {
         s.appResponsiveState = a.payload;
      },

      toggleNavigation: (s) => {
         s.navigation = !s.navigation;
      },

      toggleCart: (s) => {
         s.cart = !s.cart;
      },
      toggleUserOrder: (s) => {
         s.userOrder = !s.userOrder;
      },
      closeAll: (s) => {
         s.cart = false;
         s.navigation = false;
         s.userOrder = false;
      },
      toggleLoading: (s, a: PayloadAction<boolean>) => {
         s.loading = a.payload;
      },
      loadingSuccess: (s) => {
         s.loadingSuccess = true;
      },
      startErrorScreen: (s) => {
         s.loading = false;
         s.loadingSuccess = false;
         s.error = true;
      },
      startErrorScreenAndShowMessage: (s, a: PayloadAction<string>) => {
         s.loading = false;
         s.loadingSuccess = false;
         s.error = true;
         s.errorMessage = a.payload;
      },
      stopErrorScreen: (s) => {
         s.loadingSuccess = null;
         s.error = false;
         s.errorMessage = null;
      },
      toggleOrderHistory: (s, a: PayloadAction<boolean>) => {
         s.orderHistory = a.payload !== undefined ? a.payload : !s.orderHistory;
      },
      startCartNotification: (s) => {
         s.navigationNotification.cart = true;
      },
      startOrdersNotification: (s) => {
         s.navigationNotification.orders = true;
      },
      stopCartNotification: (s) => {
         s.navigationNotification.cart = false;
      },
      stopOrdersNotification: (s) => {
         s.navigationNotification.orders = false;
      },

      toggleMasterLogin: (s, a: PayloadAction<boolean>) => {
         s.masterLogin = !s.masterLogin;
      },

      turnOffAllDesktop: (s) => {
         s.masterLogin = false;
      },

      toggleVerifyOrder: (s, a: PayloadAction<string>) => {
         s.worker.verifyOrder = !s.worker.verifyOrder;
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
      },

      toggleCreateOrder: (s) => {
         s.worker.createOrder = !s.worker.createOrder;
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.cancelOrder = false;
      },

      toggleWorkersOff: (s) => {
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.completeOrder = false;
      },

      toggleVirtualCart: function (s) {
         s.worker.virtualCart = !s.worker.virtualCart;
      },

      toggleCancelOrder: function (s) {
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = !s.worker.cancelOrder;
      }
   }
});
export const windowActions = windowSlice.actions;
export default windowSlice.reducer;
