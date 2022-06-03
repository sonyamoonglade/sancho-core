import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppResponsiveState} from "../../types/types";


interface WindowState {
    appResponsiveState: AppResponsiveState
    navigation: boolean
    cart: boolean
    userOrder: boolean
    loading: boolean
    loadingSuccess: boolean | null
    error: boolean
    errorMessage: string
    orderHistory: boolean
    navigationNotification: {
        cart: boolean
        orders: boolean
    }
}

const initialState:WindowState = {
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
    }
}


export const windowSlice = createSlice({
    initialState,
    name:'window',
    reducers:{

        setResponsiveState: (s,a:PayloadAction<AppResponsiveState>) => {
          s.appResponsiveState = a.payload
        },

        toggleNavigation:(s) => {
            s.navigation = !s.navigation
        },

        toggleCart: (s) => {
            s.cart = !s.cart
        },
        toggleUserOrder: (s) => {
            s.userOrder = !s.userOrder
        },
        closeAll:(s) =>{
            s.cart = false
            s.navigation = false
            s.userOrder = false
        },
        toggleLoading: (s,a:PayloadAction<boolean>) => {
            s.loading = a.payload
        },
        loadingSuccess: (s) => {
          s.loadingSuccess = true
        },
        startErrorScreen: (s) => {

            s.loading = false
            s.loadingSuccess = false
            s.error = true
        },
        startErrorScreenAndShowMessage: (s, a:PayloadAction<string>) => {
            s.loading = false
            s.loadingSuccess = false
            s.error = true
            s.errorMessage = a.payload
        },
        stopErrorScreen: (s) => {
            s.loadingSuccess = null
            s.error = false
            s.errorMessage = null
        },
        toggleOrderHistory: (s, a:PayloadAction<boolean>) => {
          s.orderHistory = a.payload !== undefined ? a.payload : !s.orderHistory
        },
        startCartNotification: (s) => {
            s.navigationNotification.cart = true
        },
        startOrdersNotification: (s) => {
            s.navigationNotification.orders = true
        },
        stopCartNotification: (s) => {
            s.navigationNotification.cart = false
        },
        stopOrdersNotification: (s) => {
            s.navigationNotification.orders = false
        }



    }

})
export const windowActions = windowSlice.actions
export default windowSlice.reducer