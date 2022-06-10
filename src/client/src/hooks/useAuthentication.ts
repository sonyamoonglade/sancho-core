import {AxiosInstance} from "axios";
import {useAppDispatch, userActions} from "../redux";
import {MasterFormValues} from "../components/masterLogin/MasterLogin";


export function useAuthentication (client:AxiosInstance) {
    
    const dispatch = useAppDispatch()

    async function login (phone_number: string) {
        try {
            const body = {
                phone_number
            }
            const r = await client.post(`/users/login`, body)
            if(r.status === 200 || r.status === 201){
                return dispatch(userActions.login(phone_number))
            }
            return dispatch(userActions.logout())
        }catch (e) {
            dispatch(userActions.logout())
        }
        
    }

    async function loginMaster(formValues: MasterFormValues): Promise<boolean>{
        try {
            const body = formValues
            const r = await client.post("/users/loginMaster", body)
            if(r.status === 200) {
                dispatch(userActions.loginMaster())
                return true
            }
            return false
        }catch (e) {
            console.log(e)
            dispatch(userActions.logoutMaster())
            return null
        }

    }
    
    
    return {login,loginMaster}
    
}