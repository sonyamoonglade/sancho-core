import React, {useEffect, useState} from 'react';
import {
    useAppDispatch,
    useAppSelector,
    windowActions,
    windowSelector,
    workerActions,
    workerSelector
} from "../../../../redux";
import "./verify-order.styles.scss"
import "../../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {useAxios} from "../../../../hooks/useAxios";
import {useVerifyOrderForm} from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";
import VirtualCart from "../../virtualCart/VirtualCart";
import {useVirtualCart} from "../../hooks/useVirtualCart";
import {currency} from "../../../../common/constants";
import {useVerifyOrder} from "./hooks/useVerifyOrder";
import {utils} from "../../../../utils/util.functions";


const VerifyOrderModal = () => {


    const {worker} = useAppSelector(windowSelector)
    const {orderQueue,virtualCart:virtualCartState} = useAppSelector(workerSelector)
    const dispatch = useAppDispatch()
    const {client} = useAxios()
    const virtualCart = useVirtualCart()


    const [totalOrderPrice, setTotalOrderPrice] = useState<number>()

    const {
        formValues,
        getFormValues,
        presetDeliveryDetails,
        setFormValues,
        setFormDefaults,
        isSubmitButtonActive,
        setFormDefaultsExceptPhoneNumberAndFullname
    } = useVerifyOrderForm(orderQueue)

    const {
        verifyOrder,
        findWaitingOrderByPhoneNumber,
    } = useVerifyOrder(client,orderQueue,totalOrderPrice,virtualCartState.items)


    async function handleOrderVerification(){
        if(!isSubmitButtonActive) { return }
        const phoneNumber = formValues.phone_number_w.value
        const body: any = getFormValues()
        await verifyOrder(body,phoneNumber)
        dispatch(windowActions.toggleVerifyOrder())
    }

    function toggleVirtualCart(){
        dispatch(windowActions.toggleVirtualCart())
        presetVirtualCartItems(formValues.phone_number_w.value)
    }
    function presetVirtualCartItems(phoneNumber: string){
        if(formValues.phone_number_w.isValid){
            const order = findWaitingOrderByPhoneNumber(phoneNumber)
            const parsedCart = order.cart.map((item: any) => {
                return JSON.parse(item as unknown as string)
            })
            dispatch(workerActions.setVirtualCart(parsedCart))
            virtualCart.setVirtualCart(parsedCart)
        }
    }

    useEffect(() => {
        if(!worker.verifyOrder){
            dispatch(workerActions.setVirtualCart([]))
            virtualCart.clearVirtualCart()
            return
        }
        const currentCart = virtualCart.getCurrentCart()
        if(currentCart.length === 0){ // null value in local storage
            virtualCart.setVirtualCart([])
        }
    },[worker.verifyOrder])
    useEffect(() => {
        if(formValues.phone_number_w.isValid === false){
            setTotalOrderPrice(0);
            return
        }
        if(formValues.phone_number_w.isValid && worker.virtualCart){
            const price = utils.getOrderTotalPrice(virtualCartState.items)
            setTotalOrderPrice(price)
        }else {
            const o = findWaitingOrderByPhoneNumber(formValues.phone_number_w.value)
            const price = utils.getOrderTotalPriceByCart(o?.cart)
            setTotalOrderPrice(price)
        }
    },[formValues.phone_number_w.isValid,virtualCartState.items])


    return (
        <div className={worker.verifyOrder ? 'worker_modal --w-opened' : 'worker_modal'}>
            <p className='modal_title'>Подтвердить заказ</p>
            <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>


            <VirtualCart/>
            <VerifyOrderForm
                setFormDefaultsExceptPhoneNumberAndFullname={setFormDefaultsExceptPhoneNumberAndFullname}
                presetDeliveryDetails={presetDeliveryDetails}
                formValues={formValues}
                setFormDefaults={setFormDefaults}
                setFormValues={setFormValues}
            />
            <div className="verify_sum">
                <p>Сумма заказа</p>
                <p>{totalOrderPrice}.00 {currency}</p>
            </div>
            <button onClick={handleOrderVerification} className='modal_button'>Подтвердить</button>
        </div>
    );
};

export default React.memo(VerifyOrderModal);