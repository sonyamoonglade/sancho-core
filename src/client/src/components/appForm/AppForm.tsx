import React from 'react';
import {productSelector, productSlice, useAppDispatch, useAppSelector} from "../../redux";


const productActions = productSlice.actions

const AppForm = () => {

    const dispatch = useAppDispatch()
    const {isPresentingNow} = useAppSelector(productSelector)

    function stopPresentation(){
        dispatch(productActions.stopPresentation())
    }

    return (
        <div onClick={() => stopPresentation()} className={isPresentingNow ? 'app_form visible' : "app_form"}>
            <span></span>
        </div>
    );
};

export default AppForm;