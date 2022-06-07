import React from 'react';
import {useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../redux";

const WorkerAppForm = () => {


    const {worker} = useAppSelector(windowSelector)
    const dispatch = useAppDispatch()
    function disableAllWorker(){
        if(worker.submitOrder){
            dispatch(windowActions.toggleWorker())
        }
    }

    return (
        <div onClick={disableAllWorker} className={worker.submitOrder ? 'app_form w visible' : "app_form w"}>
            &nbsp;
        </div>
    );
};

export default WorkerAppForm;