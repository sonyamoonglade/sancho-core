import React from 'react';
import {orderSelector, useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../redux";
import "./verify-order.styles.scss"
import "../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {useAxios} from "../../../hooks/useAxios";
import {useVerifyOrderForm} from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";



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
    } = useVerifyOrderForm(orderQueue)


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
        <div className={worker.submitOrder ? 'worker_modal --w-opened' : 'worker_modal'}>
            <p className='submit_title'>Подтвердить заказ</p>
            <RiSettings4Line className='submit_settings' size={25}/>
            <VerifyOrderForm
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