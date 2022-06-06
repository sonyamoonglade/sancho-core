import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface UserState {
    isAuthenticated: boolean
    phoneNumber: string
    isMasterAuthenticated: boolean
}

const initialState:UserState = {
    isAuthenticated: false,
    phoneNumber: null,
    isMasterAuthenticated: false
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
        loginMaster:(s) => {
            s.isMasterAuthenticated = true
        },
        logoutMaster:(s) => {
            s.isMasterAuthenticated = false
        }


    }

})
export const userActions = userSlice.actions
export default userSlice.reducer