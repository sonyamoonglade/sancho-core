import axios, {AxiosError} from 'axios'
import {useAppDispatch, userSlice, workerActions} from "../redux";

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL
// todo: use nginx
if(!BACKEND_URL){
    BACKEND_URL = "https://zharpizza-backend.herokuapp.com/api/v1"
}

export function useAxios (){

    const userActions = userSlice.actions

    const dispatch = useAppDispatch()

    function responseErrorHandler(error: AxiosError){
        const statusCode = error.response.status
        if(statusCode === 401) {
            dispatch(userActions.logout())
            dispatch(userActions.logoutMaster());
        } // unauthorized
        if(process.env.NODE_ENV === 'development'){
            // console.log(error)
        }
        const responseData: any = error.response.data
        const errMSg = responseData?.message || "Непредвиденная ошибка сервера!"
        dispatch(workerActions.setError(errMSg))
        dispatch(workerActions.toggleErrorModal())
        return Promise.reject(error)

    }
    function responseSuccessHandler(s: any){
        return s
    }

    const client = axios.create({
        baseURL:BACKEND_URL,
        withCredentials: true,
    })
    client.interceptors.response.use(
       success => responseSuccessHandler(success),
        error => responseErrorHandler(error)
    )

    return {client}
}