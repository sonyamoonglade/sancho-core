import React, {useState} from 'react';
import {useAppDispatch, windowActions} from "../../../redux";

const WorkerNavigation = () => {

    const dispatch = useAppDispatch()

    function toggleOrderSubmitting(){
        dispatch(windowActions.toggleSubmitOrder())
    }

    return (
        <ul className='desktop_nav'>
            <li className="d_nav_item">
                Создать заказ
            </li>
            <li className="d_nav_item" onClick={toggleOrderSubmitting}>
                Подтвердить заказ
            </li>
            <li className="d_nav_item">
                Отменить заказ
            </li>
        </ul>
    );
};

export default WorkerNavigation;