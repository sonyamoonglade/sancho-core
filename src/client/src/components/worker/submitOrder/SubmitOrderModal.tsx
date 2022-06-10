import React, {useEffect, useMemo, useState} from 'react';
import {orderSelector, useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../redux";
import "./submit-order.styles.scss"
import "../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {useAxios} from "../../../hooks/useAxios";
import {useSubmitOrderForm} from "./hooks/useSubmitOrderForm";
import SubmitOrderForm from "./submitForm/SubmitOrderForm";



const SubmitOrderModal = () => {


    const {worker} = useAppSelector(windowSelector)
    const {orderQueue} = useAppSelector(orderSelector)
    const dispatch = useAppDispatch()
    const {client} = useAxios()

    const {
        formValues,
        getFormValues,
        presetDeliveryDetails,
        setFormValues,
        setFormDefaults,
        isSubmitButtonActive
    } = useSubmitOrderForm(orderQueue)


    async function handleOrderVerification(){

        if(!isSubmitButtonActive) { return }

        try {
            const body = getFormValues()
            await client.put("order/verify", body)
            dispatch(windowActions.toggleSubmitOrder())
        }catch (e) {
            console.log(e)
            alert(e)
        }
    }


    return (
        <div className={worker.submitOrder ? 'worker_modal --w-opened': 'worker_modal'}>
            <p className='submit_title'>Подтвердить заказ</p>
            <RiSettings4Line className='submit_settings' size={25} />
            <SubmitOrderForm
                presetDeliveryDetails={presetDeliveryDetails}
                formValues={formValues}
                setFormDefaults={setFormDefaults}
                setFormValues={setFormValues}
            />
            <button onClick={handleOrderVerification} className='modal_button'>Подтвердить</button>
        </div>
    );
};

export default SubmitOrderModal;