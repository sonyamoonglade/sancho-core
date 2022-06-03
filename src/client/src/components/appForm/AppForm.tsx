import React from 'react';
import {
    productActions,
    productSelector,
    useAppDispatch,
    useAppSelector,
    windowActions,
    windowSelector
} from "../../redux";



const AppForm = () => {

    const dispatch = useAppDispatch()
    const {isPresentingNow} = useAppSelector(productSelector)
    const {masterLogin} = useAppSelector(windowSelector)
    function stopPresentation(){
        dispatch(productActions.stopPresentation())
        if(masterLogin){
            dispatch(windowActions.toggleMasterLogin())
        }
    }

    return (
        <div onClick={() => stopPresentation()} className={(isPresentingNow || masterLogin)  ? 'app_form visible' : "app_form"}>
            <span></span>
        </div>
    );
};

export default AppForm;