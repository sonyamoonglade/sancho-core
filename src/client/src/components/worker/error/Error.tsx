import React from 'react';
import {useAppDispatch, useAppSelector, workerActions, workerSelector} from "../../../redux";

import "./error.styles.scss"

const Error = () => {

    const {error} = useAppSelector(workerSelector)
    const dispatch = useAppDispatch()


    function closeErrorWindow(){
        dispatch(workerActions.toggleErrorModal())
        setTimeout(() => {
            dispatch(workerActions.setError(""))
        },500)
    }

    return (
        <div onClick={() => closeErrorWindow()} className={error.modal ? "err --err-active" : "err"}>
            {error.val}
        </div>
    );
};

export default Error;