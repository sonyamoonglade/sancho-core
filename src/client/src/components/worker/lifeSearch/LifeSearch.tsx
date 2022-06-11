import React, {FC, useEffect, useState} from 'react';

import "./life-search.styles.scss"
import FormInput from "../../formInput/FormInput";
import {FormField} from "../../../types/types";
import {useFormValidations} from "../../../hooks/useFormValidations";
import {useDebounce} from "../../../hooks/useDebounce";
import {useAxios} from "../../../hooks/useAxios";
import {useAppDispatch, workerActions} from "../../../redux";

interface liveSearchFormState  {
    livesearch: FormField
}

interface liveSearchProps {
    extraClassName?: string
    focusRef: any
}
const LifeSearch:FC<liveSearchProps> = ({extraClassName,focusRef}) => {

    const [formValues, setFormValues] = useState<liveSearchFormState>({
        livesearch:{
            value: "",
            isValid: false
        }
    })


    const {client} = useAxios()


    const dispatch = useAppDispatch()
    const query = useDebounce(300,formValues.livesearch.value)



    useEffect(() => {
        if(query.trim().length === 0) { dispatch(workerActions.overrideResults([])) }
        else fetchQueryResults(query)
    },[query])




    async function fetchQueryResults(query:string){
        const {data} = await client.get(`/product/?query=${query}`)
        dispatch(workerActions.overrideResults(data.result))
    }



    const {minLengthValidation} = useFormValidations()

    return (
        <div className={`live_search ${extraClassName || null}`}>

            <FormInput
                name={"livesearch"}
                type={"text"}
                placeholder={"Название продукта... "}
                fieldValidationFn={minLengthValidation}
                minLength={2}
                extraClassName={"ls_input"}
                onBlurValue={""}

                formValue={formValues.livesearch}
                setV={setFormValues}
                isActiveForValidation={true}
                focusRef={focusRef}
                Regexp={new RegExp("!?[0-9]+|!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
            />

            <button className='live_search_button'>
                Найти
            </button>
        </div>
    );
};

export default LifeSearch;