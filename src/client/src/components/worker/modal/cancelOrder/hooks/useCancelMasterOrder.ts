import {useAxios} from "../../../../../hooks/useAxios";
import {useAppDispatch, windowActions} from "../../../../../redux";
import {useCallback} from "react";

export function useCancelMasterOrder(){



    const {client} = useAxios()
    const dispatch = useAppDispatch()

    const cancelMasterOrder = useCallback(async function (body: {order_id: number, cancel_explanation: string}){
        try {
            await client.put("/order/cancel", body)
            dispatch(windowActions.toggleCancelOrder())
        }catch (e) {
            alert(e)
            console.log(e)
        }

    },[client])


    return {cancelMasterOrder}

}