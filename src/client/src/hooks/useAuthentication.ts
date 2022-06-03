import {useCallback} from "react";
import {AxiosInstance} from "axios";
import {useAppDispatch, userActions} from "../redux";


export function useAuthentication (client:AxiosInstance) {
    
    const dispatch = useAppDispatch()

    const login = useCallback(async (phone_number: string) => {
        const body = {
            phone_number
        }
        await client.post(`/users/login`, body)

        dispatch(userActions.login(phone_number))
        
    },[])
    
    
    return {login}
    
}