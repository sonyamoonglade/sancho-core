import React from 'react';
import {useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions} from "../../../redux";
import "./create-order.styles.scss"
import CreateOrderForm from "./createForm/CreateOrderForm";
import {RiSettings4Line} from "react-icons/ri";
import VirtualCart from "../virtualCart/VirtualCart";

const CreateOrderModal = () => {

    const {worker} = useAppSelector(windowSelector)

    const dispatch = useAppDispatch()

    function toggleVirtualCart(){
        dispatch(windowActions.toggleVirtualCart())
    }




    return (
        <div className={worker.createOrder ? 'worker_modal create --w-opened' : 'worker_modal create'}>


        <p className='modal_title'>Создать заказ</p>
        <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>
        <VirtualCart/>
        <CreateOrderForm

        />



        </div>
    );
};

export default CreateOrderModal;