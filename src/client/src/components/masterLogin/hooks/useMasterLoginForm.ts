import {useMemo, useState} from "react";
import {MasterFormState, MasterFormValues} from "../MasterLogin";

export function useMasterLoginForm(){

    const [formValues, setFormValues] = useState<MasterFormState>({
        login:{
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: false
        }
    })
    function getFormValues():MasterFormValues {
        return {
            login: formValues.login.value,
            password: formValues.password.value
        }
    }
    const defaultValues:MasterFormState = {
        login: {
            isValid: false,
            value: ""
        },
        password: {
            isValid: false,
            value: ""
        }
    }
    function setDefaultValues(){
        setFormValues(defaultValues)
    }

    const formValidity = useMemo(() => {
        return checkIsAllValid()
    },[formValues])
    function checkIsAllValid(){
        for(const v of Object.values(formValues)){
            if(v.isValid !== true){
                return false
            }
        }
        return true
    }


    return {getFormValues, formValidity, formValues, setFormValues}
}