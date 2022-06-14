import React, {useMemo} from 'react';
import {useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions} from "../../../redux";
import {useVirtualCart} from "../hooks/useVirtualCart";

const WorkerAppForm = () => {


    const {worker} = useAppSelector(windowSelector)
    const dispatch = useAppDispatch()
    const {setVirtualCart} = useVirtualCart()
    function disableAllWorker(){
        if(isActive){
            dispatch(windowActions.toggleWorkersOff())
            dispatch(workerActions.setVirtualCart([]))
            setVirtualCart([])
        }
    }

    const isActive = useMemo(() => {
        const values = Object.values(worker)
        if(values.some((v: boolean) => v === true)){

            document.body.style.overflow = 'hidden'

            return true
        }
        document.body.style.overflow = 'visible'
        return false
    },[worker])

    return (
        <div onClick={disableAllWorker} className={isActive ? 'app_form w visible' : "app_form w"}>
            &nbsp;
        </div>
    );
};

export default WorkerAppForm;