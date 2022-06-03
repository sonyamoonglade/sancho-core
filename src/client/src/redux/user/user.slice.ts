import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface UserState {
    isAuthenticated: boolean
    phoneNumber: string
}

const initialState:UserState = {
    isAuthenticated: false,
    phoneNumber: null
}


export const userSlice = createSlice({
    initialState,
    name:'user',
    reducers:{

        login:(s,a:PayloadAction<string>) => {
            s.phoneNumber = a.payload
            s.isAuthenticated = true
        },

        logout:(s) => {
            s.isAuthenticated = false
        },



    }

})
export const userActions = userSlice.actions
export default userSlice.reducer