import React from 'react';
import {useAppDispatch, windowActions} from "../../../redux";

const WorkerNavigation = () => {

    const dispatch = useAppDispatch()

    function toggleOrderVerification(){
        dispatch(windowActions.toggleVerifyOrder())
    }
    function toggleOrderCreation(){
        dispatch(windowActions.toggleCreateOrder())
    }

    return (
        <ul className='desktop_nav'>
            <li className="d_nav_item" onClick={toggleOrderCreation}>
                Создать заказ
            </li>
            <li className="d_nav_item" onClick={toggleOrderVerification}>
                Подтвердить заказ
            </li>
            <li className="d_nav_item">
                Отменить заказ
            </li>
        </ul>
    );
};

export default WorkerNavigation;