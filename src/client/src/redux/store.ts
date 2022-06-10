import {configureStore} from "@reduxjs/toolkit";
import productReducer from './product/product.slice'
import userReducer from './user/user.slice'
import windowReducer from './window/window.slice'
import orderReducer from './order/order.slice'
import workerReducer from "./worker/worker.slice"

export const store = configureStore({
    reducer:{
        productReducer,
        userReducer,
        windowReducer,
        orderReducer,
        workerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch