import {useAxios} from "../../../../../hooks/useAxios";
import {useCallback} from "react";

export function useCancelMasterOrder(){

    const {client} = useAxios()

    const cancelMasterOrder = useCallback(async function (body: {order_id: number, cancel_explanation: string}){
        await client.put("/order/cancel", body)
    },[client])


    return {cancelMasterOrder}

}