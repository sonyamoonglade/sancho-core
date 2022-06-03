import {AxiosInstance} from "axios";
import {FormValuesInterface} from "../components/order/userOrder/Order";
import {useCallback} from "react";
import {DatabaseCartProduct} from "../common/types";

export function useCreateOrder (client: AxiosInstance){



    const createUserOrder = useCallback(async function (formValues: FormValuesInterface, cart: DatabaseCartProduct[]){

        let body = {
            ...formValues,
            cart
        }

        const response = await client.post(`order/createUserOrder`, body)
        return response.data



    },[])

    return {createUserOrder}

}