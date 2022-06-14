import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {OrderQueue, Product} from "../../common/types";



interface WorkerInitialState {
    queryResults: Product[]
    error: string
    orderQueue: OrderQueue
}

const initialState:WorkerInitialState = {
    queryResults: null,
    error: null,
    orderQueue: null
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
    }
})

export default workerSlice.reducer
export const workerActions = workerSlice.actions