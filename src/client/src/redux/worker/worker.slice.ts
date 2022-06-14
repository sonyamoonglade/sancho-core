import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DatabaseCartProduct, OrderQueue, Product} from "../../common/types";



interface WorkerInitialState {
    queryResults: Product[]
    virtualCart: {
        items: DatabaseCartProduct[]
    }
    error: string
    orderQueue: OrderQueue

}

const initialState:WorkerInitialState = {
    queryResults: null,
    error: null,
    orderQueue: null,
    virtualCart: {
        items: []
    },
}

const workerSlice = createSlice({
    initialState,
    name: "worker",
    reducers: {

        overrideResults: function (s,a:PayloadAction<Product[]>) {
            s.queryResults = a.payload
            s.error = null
        },

        setError: function (s, a:PayloadAction<string>){
            s.error = a.payload
        },
        setOrderQueue: function(s, a:PayloadAction<OrderQueue>) {
            s.orderQueue = a.payload
            s.error = null
        },
        setVirtualCart: function(s, a:PayloadAction<DatabaseCartProduct[]>){
            s.virtualCart.items = a.payload
        }

    }
})

export default workerSlice.reducer
export const workerActions = workerSlice.actions