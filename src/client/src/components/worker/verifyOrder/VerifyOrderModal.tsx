import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
    orderSelector,
    useAppDispatch,
    useAppSelector,
    windowActions,
    windowSelector,
    workerSelector
} from "../../../redux";
import "./verify-order.styles.scss"
import "../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {useAxios} from "../../../hooks/useAxios";
import {useVerifyOrderForm} from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";
import VirtualCart from "../virtualCart/VirtualCart";
import {useCart} from "../../../hooks/useCart";
import LifeSearch from "../lifeSearch/LifeSearch";
import LiveSearchResultContainer from "../lifeSearch/LiveSearchResultContainer";
import {useVirtualCart} from "../hooks/useVirtualCart";
import {currency} from "../../../common/constants";


const VerifyOrderModal = () => {


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
        isSubmitButtonActive,
        setFormDefaultsExceptPhoneNumberAndFullname
    } = useVerifyOrderForm(orderQueue)


    async function handleOrderVerification(){

        if(!isSubmitButtonActive) { return }

        try {
            const body = getFormValues()
            await client.put("order/verify", body)
            dispatch(windowActions.toggleVerifyOrder())
        }catch (e) {
            console.log(e)
            alert(e)
        }
    }

    const [isVirtualCartActive, setIsVirtualCartActive] = useState(false)
    const focusRef = useRef<HTMLInputElement>(null)

    function toggleVirtualCart(){
        setIsVirtualCartActive(p => !p)
    }

    const {queryResults} = useAppSelector(workerSelector)

    const virtualCart = useVirtualCart()
    const [vcart, setVCart] = useState([])
    const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0)

    useEffect(() => {

        if(!isVirtualCartActive){
            setVCart([])
            virtualCart.clearVirtualCart()
            return
        }

        const currentCart = virtualCart.getCurrentCart()
        if(currentCart.length === 0){ // null value in local storage
            virtualCart.setVirtualCart([])
        }else {
            virtualCart.clearVirtualCart()
            setVCart([])
        }

    },[isVirtualCartActive])

    useEffect(() => {
        if(!worker.verifyOrder){
            setIsVirtualCartActive(false)
        }
    },[worker.verifyOrder])

    function getOrderTotalPrice(phoneNumber: string){
       const order = orderQueue?.waiting.find(o => {
            if(o.phone_number === `+7${phoneNumber}`){
                return o
            }
            return undefined
        })

        return order?.total_cart_price || 0
    }

    useEffect(() => {
        if(formValues.phone_number_w.isValid){
            const price = getOrderTotalPrice(formValues.phone_number_w.value)
            setTotalOrderPrice(price)
        }else{
            setTotalOrderPrice(0)
        }
    },[formValues.phone_number_w.isValid])

    return (
        <div className={worker.verifyOrder ? 'worker_modal --w-opened' : 'worker_modal'}>
            <p className='modal_title'>Подтвердить заказ</p>
            <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>

            <div className={isVirtualCartActive ? 'livesearch_container --ls-active ' : "livesearch_container"}>
                <LifeSearch isActive={isVirtualCartActive} focusRef={focusRef} extraClassName={"verify"} />
                <LiveSearchResultContainer vcart={virtualCart} setVirtualCart={setVCart} focusRef={focusRef} result={queryResults}/>
            </div>

            <VirtualCart isActive={isVirtualCartActive} items={vcart} setVirtualCart={setVCart}/>
            <VerifyOrderForm
                setFormDefaultsExceptPhoneNumberAndFullname={setFormDefaultsExceptPhoneNumberAndFullname}
                presetDeliveryDetails={presetDeliveryDetails}
                formValues={formValues}
                setFormDefaults={setFormDefaults}
                setFormValues={setFormValues}
            />
            <div className="verify_sum">
                <p>Сумма заказа </p>
                <p>{totalOrderPrice}.00 {currency}</p>
            </div>
            <button onClick={handleOrderVerification} className='modal_button'>Подтвердить</button>
        </div>
    );
};

export default React.memo(VerifyOrderModal);