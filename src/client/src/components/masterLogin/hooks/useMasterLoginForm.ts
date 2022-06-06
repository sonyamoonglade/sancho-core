import {useMemo, useState} from "react";
import {MasterFormState, MasterFormValues} from "../MasterLogin";

export function useMasterLoginForm(){

    const [masterFormState, setMasterFormState] = useState<MasterFormState>({
        login:{
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: true
        }
    })
    function getFormValues():MasterFormValues {
        return {
            login: masterFormState.login.value,
            password: masterFormState.password.value
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
        setMasterFormState(defaultValues)
    }

    const formValidity = useMemo(() => {
        return checkIsAllValid()
    },[masterFormState])
    function checkIsAllValid(){
        for(const v of Object.values(masterFormState)){
            if(v.isValid !== true){
                return false
            }
        }
        return true
    }


    return {getFormValues, formValidity, setMasterFormState, masterFormState}
}