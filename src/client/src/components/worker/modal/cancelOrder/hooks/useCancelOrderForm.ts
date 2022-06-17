import {FormField} from "../../../../../types/types";
import {useEffect, useMemo, useState} from "react";
import {utils} from "../../../../../utils/util.functions";
import {WaitingQueueOrder} from "../../../../../common/types";
import {useAppSelector, workerSelector} from "../../../../../redux";


export interface CancelOrderFormState {
    orderId: FormField
    cancelExplanation: FormField
    cancellable: boolean
}

const formDefaults:CancelOrderFormState = {
    orderId:{
        value: "",
        isValid: false
    },
    cancelExplanation: {
        value: "",
        isValid: false
    },
    cancellable: false
}







export function useCancelOrderForm(){


    const [formValues,setFormValues] = useState<CancelOrderFormState>(formDefaults)
    const {orderQueue} = useAppSelector(workerSelector)

    function setFormDefaults(){
        setFormValues(formDefaults)
    }

    useEffect(() => {
        if(formValues.orderId.isValid){
            const orderId = Number(formValues.orderId.value)
            const o:WaitingQueueOrder = utils.findOrderInWaitingQ(orderQueue,orderId)
            if(o){
                return setCancellable(true)
            }
        }
        return setCancellable(false)


    },[formValues.orderId.isValid])


    const cancellable = useMemo(() => {
        return formValues.cancellable
    },[formValues.cancellable])

    function setCancellable(v: boolean): void{
        setFormValues((state:CancelOrderFormState) => {
            return {...state, cancellable: v}
        })
        return
    }



    return {formValues, setFormValues, setFormDefaults,cancellable}
}