import React, {useEffect} from 'react';

import './order.styles.scss'
import {TiArrowBack} from "react-icons/ti";
import {GrFormClose} from 'react-icons/gr'
import {useCreateOrder} from "./hooks/useCreateOrder";
import {useCart} from "../../hooks/useCart";
import {productActions, useAppDispatch, useAppSelector, userSelector, windowActions, windowSelector} from "../../redux";
import OrderForm from "./orderForm/OrderForm";
import SubmitOrderButton from "./submitOrderButton/SubmitOrderButton";
import Check from "./check/Check";
import {useUserOrderForm} from "./hooks/useUserOrderForm";
import {baseUrl} from "../product/productPresentation/ProductPresentation";
import {useAxios} from "../../hooks/useAxios";
import {useAuthentication} from "../../hooks/useAuthentication";
import {FormField} from "../../types/types";
import {DeliveryDetails} from "../../common/types";


export interface UserOrderFormValuesInterface {
    is_delivered: boolean
    phone_number: string
    delivery_details?: DeliveryDetails
}

export interface UserOrderFormState {

    phone_number:FormField
    is_delivered:{
        value: boolean,
        isValid: boolean
    }
    entrance_number?:FormField
    floor?:FormField
    flat_call?:FormField
    address: FormField
}


const Order = () => {
    const cart = useCart()
    const {client} = useAxios()
    const {createUserOrder} = useCreateOrder(client)
    const {login} = useAuthentication(client)
    const {userOrder} = useAppSelector(windowSelector)
    const {isAuthenticated,phoneNumber:userPhoneNumber} = useAppSelector(userSelector)
    const dispatch = useAppDispatch()

    const {
        formValues,
        isSubmitButtonActive,
        setFormValues,
        setFormDefaults,
        getFormValues
    } = useUserOrderForm()

    useEffect(() => {
       if(userOrder){
           document.querySelector('.phone_number_input').classList.remove('--valid')

           document.body.style.overflow = 'hidden'

       }
       else {
           document.body.style.overflow = 'visible'
       }
    },[userOrder])

    function toggleOrder(){
        dispatch(windowActions.toggleUserOrder())
    }
    function closeAllModals(){
        dispatch(windowActions.closeAll())
    }

    async function handleOrderCreation(){

        const formValues = getFormValues()
        const usrCart = cart.getCart()
        const {phone_number:formPhoneNumber} = formValues

        try {
            if(!isAuthenticated){
                await login(formPhoneNumber)
            }else if(formPhoneNumber !== userPhoneNumber) {
                await login(formPhoneNumber)
            }

        }catch (e: any) {
            const message = e?.response?.data?.message
            setFormValues((p:UserOrderFormState) => {
                const s = {...p}
                s.phone_number.value = ""
                s.phone_number.isValid = false
                return s
            })
            dispatch(windowActions.toggleLoading(false));
            return dispatch(windowActions.startErrorScreenAndShowMessage(message || "Ошибочка..."))
        }

        try {
            await createUserOrder(formValues, usrCart)
            cart.clearCart()
            setFormDefaults()
            dispatch(productActions.setCartEmpty(true))
            setFormValues((p:UserOrderFormState) => {
                const s = {...p}
                s.phone_number.value = ""
                s.phone_number.isValid = false
                return s
            })
            dispatch(productActions.setTotalCartPrice(0))
        }catch (e: any) {
            const message = e?.response?.data?.message
            dispatch(windowActions.toggleLoading(false));
            setFormValues((p:UserOrderFormState) => {
                const s = {...p}
                s.phone_number.value = ""
                s.phone_number.isValid = false
                return s
            })
            return dispatch(windowActions.startErrorScreenAndShowMessage(message || "Ошибочка..."))
        }
    }

    return (
        <div

            className={userOrder ? 'make_user_order modal modal--visible' : 'make_user_order modal'}>
            <div className="user_order_header">
                <TiArrowBack onClick={() => toggleOrder()} className='user_order_back_icon' size={30} />
                <p className='user_order_title'>Оформление заказа</p>
                <GrFormClose onClick={() => closeAllModals()} className='user_order_close_icon' size={30} />
            </div>
            <div className="make_user_order_form">

                <img className='badge_image' src={`${baseUrl}/non_verified_badge.png`} alt=""/>
                <p className='check_title'>Чек</p>

                <div className="form_top">
                    <Check isDelivered={formValues.is_delivered.value} cart={cart} />

                </div>
                <OrderForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                />

                {userOrder && <SubmitOrderButton handler={ handleOrderCreation}  isActive={isSubmitButtonActive} />}

            </div>
        </div>
    );
};

export default React.memo(Order);