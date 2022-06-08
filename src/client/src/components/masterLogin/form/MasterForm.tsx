import React, {FC, useMemo, useState} from 'react';
import {AppResponsiveState} from "../../../types/types";
import FormInput from "../../formInput/FormInput";
import '../master-login.styles.scss'
import {MasterFormState, MasterFormValues} from "../MasterLogin";
import {useFormValidations} from "../../../hooks/useFormValidations";
import {useAxios} from "../../../hooks/useAxios";
import {useAuthentication} from "../../../hooks/useAuthentication";
import {useMasterLoginForm} from "../hooks/useMasterLoginForm";
import {useNavigate} from "react-router-dom";

interface masterFormProps{
    appResponsiveState: AppResponsiveState
}


const MasterForm:FC<masterFormProps> = ({appResponsiveState}) => {

    const {minLengthValidation} = useFormValidations()

    const {client} = useAxios()
    const {loginMaster} = useAuthentication(client)
    const router = useNavigate()

    const {
        masterFormState,
        setMasterFormState,
        getFormValues,
        formValidity
    } = useMasterLoginForm()

    async function handleLogin(){
        if(!formValidity) { return }
        const formValues = getFormValues()
        const res = await loginMaster(formValues)
        if(res){
            return router("/worker/queue",{replace: true})
        }
        return router("/", {replace: true})
    }

    return (

        <div className="master_form">
            {
                appResponsiveState === AppResponsiveState.computer ?
                    <p className='login_title'>Вход в систему</p> : null
            }
            <FormInput
                name={'login'}
                type={'text'}
                placeholder={"Логин"}
                formValue={masterFormState.login}
                setV={setMasterFormState}
                onBlurValue={""}
                minLength={15}
                fieldValidationFn={minLengthValidation}
            />
            <FormInput
                name={'password'}
                type={'password'}
                placeholder={"Пароль"}
                formValue={masterFormState.password}

                setV={setMasterFormState}
                onBlurValue={""}
                minLength={15}
                fieldValidationFn={minLengthValidation}
            />
            <button onClick={handleLogin} className='master_login_button'>
                <p>Войти</p>
            </button>
        </div>
    );
};

export default MasterForm;