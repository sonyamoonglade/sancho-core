import {useState} from "react";
import {FormField} from "../../../../types/types";

export interface WorkerCreateOrderFormState {
    verified_fullname_c:FormField
    phone_number_c:FormField
    address_c: FormField
    entrance_number_c: FormField
    flat_call_c: FormField
    floor_c: FormField
    is_delivered_c:{
        value: boolean,
        isValid: boolean
    }
}

const formDefaults:WorkerCreateOrderFormState = {
    verified_fullname_c:{
        value: "",
        isValid: false
    },
    phone_number_c:{
        value: "",
        isValid: false
    },
    address_c: {
        value:"",
        isValid: false
    },
    entrance_number_c: {
        value:"",
        isValid: false
    },
    flat_call_c: {
        value:"",
        isValid: false
    },
    floor_c: {
        value:"",
        isValid: false
    },
    is_delivered_c: {
        value: false,
        isValid: true
    },
}



export function useCreateOrderForm (){

    const [formValues, setFormValues] = useState<WorkerCreateOrderFormState>(formDefaults)



    function setFormDefaults(){
        setFormValues(formDefaults)
        formValues.is_delivered_c.value = false
    }




    return {setFormDefaults, setFormValues, formValues}



}