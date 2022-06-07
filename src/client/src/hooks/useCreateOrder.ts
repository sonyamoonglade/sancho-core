import {AxiosInstance} from "axios";
import {UserOrderFormValuesInterface} from "../components/order/userOrder/Order";
import {useCallback} from "react";
import {DatabaseCartProduct} from "../common/types";

export function useCreateOrder (client: AxiosInstance){



    const createUserOrder = useCallback(async function (formValues: UserOrderFormValuesInterface, cart: DatabaseCartProduct[]){
        const {is_delivered,delivery_details} = formValues
        let body = {
            is_delivered,
            delivery_details: (delivery_details !== undefined) ? delivery_details : null,
            cart
        }

        const response = await client.post(`order/createUserOrder`, body)
        return response.data



    },[])

    return {createUserOrder}

}