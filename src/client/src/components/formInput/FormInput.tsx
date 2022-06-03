import React, {FC, HTMLInputTypeAttribute, useEffect, useRef, useState} from 'react';

import './form-input.styles.scss'
import {useAppSelector, windowSelector} from "../../redux";

interface formInputProps {
    name: string
    type: HTMLInputTypeAttribute
    placeholder: string
    v: any
    setV: Function
    fieldValidationFn?: Function
    onBlurValue: string
    maxLength?: number
    extraClassName?: string
    Regexp?: RegExp
    minLength: number
}

const FormInput:FC<formInputProps> = (props) => {


    const [isValid, setIsValid] = useState<boolean>(false)
    const [inputTagClasses,setInputTagClasses] = useState<string[]>([])
    const {loadingSuccess,error} = useAppSelector(windowSelector)
    const inputRef = useRef<HTMLInputElement>(null)



    const {
        type,
        name,
        placeholder,
        v,
        setV,
        fieldValidationFn,
        onBlurValue,
        maxLength,
        extraClassName,
        Regexp,
        minLength
    } = props



    useEffect(() => {
        if(!isValid){
           return setInputTagClasses((p) => ["--invalid"])
       }

       else {
           setInputTagClasses((p) => ["--valid"])
       }

    },[isValid])

    useEffect(() => {
        if(loadingSuccess){
            setIsValid(false)
        }
        if (error){
            if(name === "phone_number"){
                setIsValid(false)
            }
        }
    },[loadingSuccess,error])


    return (

            <div className={`${extraClassName || ""} form_input_container ${inputTagClasses.join(' ')}`}>

                <label htmlFor={name} className='form_input_label'>
                    {onBlurValue}
                </label>

                <input
                    ref={inputRef}

                    onBlur={(e) => {

                        if(v.trim().length < minLength || v.trim().length === 0){

                            setV((state: any) => {
                                const obj:{value:string,isValid: boolean} = {
                                    value: state[e.target.name].value,
                                    isValid: state[e.target.name].isValid
                                }

                                obj.value = ""
                                return {...state, [e.target.name]: obj}
                            })
                        }
                        return
                    }}
                    id={name}
                    placeholder={placeholder}
                    type={type}
                    maxLength={maxLength || 100}
                    name={name}
                    value={v}
                    onChange={(e) => {
                        const inputValue = e.target.value
                        if(Regexp && inputValue.match(Regexp)) return
                        let validationResult = false
                        if(fieldValidationFn !== undefined){
                            validationResult = fieldValidationFn(inputValue, minLength)
                            setIsValid(validationResult)
                        }
                        setV((state: any) =>{


                            const obj = {
                                value: e.target.value,
                                isValid: validationResult
                            }

                            return {...state, [e.target.name]: obj}
                        })

                    }}
                    className={`form_input`}
                />
            </div>

    );
};

export default React.memo(FormInput);