import React, {useEffect, useState} from 'react';
import './master-login.styles.scss'
import {useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../redux";
import {AppResponsiveState} from "../../types/types";
import {TiArrowBack} from "react-icons/ti";
import FormInput from "../formInput/FormInput";
import {useFormValidations} from "../../hooks/useFormValidations";
import MasterLoginButton from "./loginButton/MasterLoginButton";


const MasterLogin = () => {


    const {masterLogin,appResponsiveState} = useAppSelector(windowSelector)
    const dispatch = useAppDispatch()
    function toggleMasterLogin(){
        dispatch(windowActions.toggleMasterLogin())
    }

    useEffect(() =>{
        if(masterLogin){
            document.body.style.overflow = 'hidden'
        }
        else document.body.style.overflow = 'visible'
    },[masterLogin])

    const [masterFormState, setMasterFormState] = useState({
        login:{
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: true
        }
    })


    const {minLengthValidation} = useFormValidations()
    return (
        <div className={masterLogin ? 'master_login modal modal--visible': "master_login modal"}>
            {
                appResponsiveState === AppResponsiveState.mobileOrTablet ?
                    <div className='master_login_header'>
                        <TiArrowBack onClick={toggleMasterLogin} className='cart_back_icon' size={30} />
                        <div className='center_part'>
                            <p>Вход в систему</p>
                        </div>
                    </div> :
                    null
            }

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
        </div>
    );
};

export default MasterLogin;