import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../common/types";



interface WorkerInitialState {
    queryResults: Product[]
}

const initialState:WorkerInitialState = {
    queryResults: null
}

const workerSlice = createSlice({
    initialState,
    name: "worker",
    reducers: {

        overrideResults: function (s,a:PayloadAction<Product[]>){
            s.queryResults = a.payload
        }

    }
})

export default workerSlice.reducer
export const workerActions = workerSlice.actions