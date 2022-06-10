import React, {FC, useEffect, useState} from 'react';

import "./life-search.styles.scss"
import FormInput from "../../formInput/FormInput";
import {FormField} from "../../../types/types";
import {useFormValidations} from "../../../hooks/useFormValidations";
import {useDebounce} from "../../../hooks/useDebounce";
import {useAxios} from "../../../hooks/useAxios";

interface liveSearchFormState  {
    livesearch: FormField
}

interface liveSearchProps {
    extraClassName?: string
}
const LifeSearch:FC<liveSearchProps> = ({extraClassName}) => {

    const [formValues, setFormValues] = useState<liveSearchFormState>({
        livesearch:{
            value: "",
            isValid: false
        }
    })


    const {client} = useAxios()

    const query = useDebounce(1000,formValues.livesearch.value)

    if(query === formValues.livesearch.value){
        if(query.trim().length === 0) {  }
        else
        fetchQueryResults(query)
    }


    async function fetchQueryResults(query:string){
        const {data} = await client.get(`/product/?query=${query}`)
        console.log(data)
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
                Regexp={new RegExp("!?[0-9]+|!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
            />

            <button className='live_search_button'>
                Найти
            </button>
        </div>
    );
};

export default LifeSearch;