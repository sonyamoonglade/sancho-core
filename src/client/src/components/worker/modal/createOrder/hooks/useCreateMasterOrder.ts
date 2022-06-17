import {useAxios} from "../../../../../hooks/useAxios";
import {useCallback} from "react";
import {useAppDispatch, windowActions} from "../../../../../redux";

export function useCreateMasterOrder(){
    
    const {client} = useAxios()
    const dispatch = useAppDispatch()

    const createMasterOrder = useCallback(async function (body: any){
        
        try {
            
            await client.post("/order/createMasterOrder", body)
            dispatch(windowActions.toggleCreateOrder())
        }catch (e) {
            alert(e)
            console.log(e)
        }
        
    },[client])
    
    
    return {createMasterOrder}
}