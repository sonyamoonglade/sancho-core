import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppResponsiveState } from "../../types/types";
import { Droppable } from "../../components/orderHistory/OrderHistoryItem";

interface WindowState {
   masterLogin: boolean;
   appResponsiveState: AppResponsiveState;
   navigation: boolean;
   cart: boolean;
   userOrder: boolean;
   pay: boolean;
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
      completeList: boolean;
      cancelList: boolean;
      mark: boolean;
      details: boolean;
   };
   admin: {
      edit: boolean;
      create: boolean;
   };

   drag: {
      item: Droppable;
      dropzone: string;
   };
}

const initialState: WindowState = {
   masterLogin: false,
   pay: false,
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
      details: false,
      verifyOrder: false,
      createOrder: false,
      cancelOrder: false,
      virtualCart: false,
      completeOrder: false,
      cancelList: false,
      completeList: false,
      mark: false
   },
   admin: {
      edit: false,
      create: false
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
      toggleEditModal: function (s, a?: PayloadAction<boolean>) {
         s.admin.edit = a?.payload || !s.admin.edit;
      },
      toggleCreateModal: function (s, a?: PayloadAction<boolean>) {
         s.admin.create = a?.payload || !s.admin.create;
      },
      togglePay: function (s, a?: PayloadAction<boolean>) {
         s.pay = a?.payload || !s.pay;
      },
      toggleCompleteList: function (s, a: PayloadAction<boolean>) {
         s.worker.completeList = a?.payload || !s.worker.completeList;
         s.worker.virtualCart = false;
         s.worker.details = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.verifyOrder = false;
         s.worker.completeOrder = false;
         s.worker.mark = false;
      },
      toggleCancelList: function (s, a: PayloadAction<boolean>) {
         s.worker.cancelList = a?.payload || !s.worker.cancelList;
         s.worker.virtualCart = false;
         s.worker.createOrder = false;
         s.worker.details = false;
         s.worker.cancelOrder = false;
         s.worker.verifyOrder = false;
         s.worker.completeOrder = false;
         s.worker.mark = false;
      },
      toggleCompleteOrder: function (s, a: PayloadAction<boolean>) {
         s.worker.completeOrder = a.payload || !s.worker.completeOrder;
         s.worker.virtualCart = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.details = false;
         s.worker.verifyOrder = false;
         s.worker.mark = false;
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
         s.pay = false;
         s.orderHistory = false;
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
         s.pay = false;
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

      toggleVerifyOrder: (s) => {
         s.worker.verifyOrder = !s.worker.verifyOrder;
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.createOrder = false;
         s.worker.details = false;
         s.worker.cancelOrder = false;
         s.worker.mark = false;
      },

      toggleCreateOrder: (s) => {
         s.worker.createOrder = !s.worker.createOrder;
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.cancelOrder = false;
         s.worker.details = false;
         s.worker.mark = false;
         s.worker.details = false;
      },

      toggleWorkersOff: (s) => {
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.completeOrder = false;
         s.worker.details = false;
         s.worker.mark = false;
      },

      toggleVirtualCart: function (s) {
         s.worker.virtualCart = !s.worker.virtualCart;
      },

      toggleCancelOrder: function (s) {
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.verifyOrder = false;
         s.worker.details = false;
         s.worker.mark = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = !s.worker.cancelOrder;
      },

      toggleMark: function (s) {
         s.worker.completeOrder = false;
         s.worker.virtualCart = false;
         s.worker.details = false;
         s.worker.verifyOrder = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.mark = !s.worker.mark;
      },

      toggleDetails: function (s) {
         s.worker.virtualCart = false;
         s.worker.details = false;
         s.worker.completeOrder = false;
         s.worker.verifyOrder = false;
         s.worker.createOrder = false;
         s.worker.cancelOrder = false;
         s.worker.mark = false;
         s.worker.details = !s.worker.details;
      },
      closeAllAdmin: function (s) {
         s.admin.edit = false;
         s.admin.create = false;
      }
   }
});
export const windowActions = windowSlice.actions;
export default windowSlice.reducer;
