import React, {FC} from 'react';
import {AppResponsiveState} from "../../../types/types";
import FormInput from "../../formInput/FormInput";
import MasterLoginButton from "../loginButton/MasterLoginButton";
import '../master-login.styles.scss'
import {MasterFormState} from "../MasterLogin";
import {useFormValidations} from "../../../hooks/useFormValidations";

interface masterFormProps{
    masterFormState: MasterFormState
    appResponsiveState: AppResponsiveState
    setMasterFormState: Function
}


const MasterForm:FC<masterFormProps> = ({masterFormState,appResponsiveState,setMasterFormState}) => {

    const {minLengthValidation} = useFormValidations()

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
                v={masterFormState.login.value}
                setV={setMasterFormState}
                onBlurValue={""}
                minLength={15}
                fieldValidationFn={minLengthValidation}
            />
            <FormInput
                name={'password'}
                type={'password'}
                placeholder={"Пароль"}
                v={masterFormState.password.value}
                setV={setMasterFormState}
                onBlurValue={""}
                minLength={15}
                fieldValidationFn={minLengthValidation}
            />
            <MasterLoginButton />
        </div>
    );
};

export default MasterForm;