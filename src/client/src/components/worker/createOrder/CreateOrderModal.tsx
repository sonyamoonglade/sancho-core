import React from 'react';
import {useAppSelector, windowSelector} from "../../../redux";
import "./create-order.styles.scss"
import CreateOrderForm from "./createForm/CreateOrderForm";

const CreateOrderModal = () => {

    const {worker} = useAppSelector(windowSelector)




    return (
        <div className={worker.createOrder ? 'worker_modal create --w-opened' : 'worker_modal create'}>


        <p className='modal_title'>Создать заказ</p>
        {/*lifesearch go here*/}

        <CreateOrderForm

        />



        </div>
    );
};

export default CreateOrderModal;