import {AxiosInstance} from "axios";
import {AppDispatch} from "../store";
import {userActions} from "./user.slice";


export const authMe = (client: AxiosInstance) => async (dispatch:AppDispatch) => {

    try {
        const res = await client.get(`/users/auth/me`)
        if(res.status === 200){
            dispatch(userActions.login(res.data.phone_number))
        }
    }catch (e) {
        // console.log(e)
        dispatch(userActions.logout())
    }
}