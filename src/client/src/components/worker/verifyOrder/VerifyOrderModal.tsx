import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector, windowSelector, workerSelector} from "../../../redux";
import "./verify-order.styles.scss"
import "../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {useAxios} from "../../../hooks/useAxios";
import {useVerifyOrderForm} from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";
import VirtualCart from "../virtualCart/VirtualCart";
import LifeSearch from "../lifeSearch/LifeSearch";
import LiveSearchResultContainer from "../lifeSearch/LiveSearchResultContainer";
import {useVirtualCart} from "../hooks/useVirtualCart";
import {currency} from "../../../common/constants";
import {DatabaseCartProduct} from "../../../common/types";
import {useVerifyOrder} from "./hooks/useVerifyOrder";


const VerifyOrderModal = () => {


    const {worker} = useAppSelector(windowSelector)
    const {orderQueue,queryResults} = useAppSelector(workerSelector)

    const {client} = useAxios()
    const virtualCart = useVirtualCart()

    const focusRef = useRef<HTMLInputElement>(null)
    
    const [isVirtualCartActive, setIsVirtualCartActive] = useState<boolean>(false)
    const [vcart, setVCart] = useState<DatabaseCartProduct[]>([])
    const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0)

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
        getOrderTotalPrice
    } = useVerifyOrder(client,orderQueue,totalOrderPrice,vcart)


    async function handleOrderVerification(){
        if(!isSubmitButtonActive) { return }
        const phoneNumber = formValues.phone_number_w.value
        const body: any = getFormValues()
        await verifyOrder(body,phoneNumber)
    }

    function toggleVirtualCart(){
        setIsVirtualCartActive(p => !p)
        presetVirtualCartItems(formValues.phone_number_w.value)
    }
    function presetVirtualCartItems(phoneNumber: string){
        if(formValues.phone_number_w.isValid){
            const order = findWaitingOrderByPhoneNumber(phoneNumber)
            const parsedCart = order.cart.map((item) => {
                return JSON.parse(item as unknown as string)
            })
            setVCart(parsedCart)
            virtualCart.setVirtualCart(parsedCart)
        }
    }

    useEffect(() => {
        if(!worker.verifyOrder){
            setIsVirtualCartActive(false)
            setVCart([])
            virtualCart.clearVirtualCart()
            return
        }
        const currentCart = virtualCart.getCurrentCart()
        if(currentCart.length === 0){ // null value in local storage
            virtualCart.setVirtualCart([])
        }
    },[worker.verifyOrder])
    useEffect(() => {
        if(formValues.phone_number_w.isValid){
            const price = getOrderTotalPrice()
            setTotalOrderPrice(price)
        }else{
            setTotalOrderPrice(0)
        }
    },[formValues.phone_number_w.isValid,vcart])


    return (
        <div className={worker.verifyOrder ? 'worker_modal --w-opened' : 'worker_modal'}>
            <p className='modal_title'>Подтвердить заказ</p>
            <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>

            <div className={isVirtualCartActive ? 'livesearch_container --ls-active ' : "livesearch_container"}>
                <LifeSearch
                    isActive={isVirtualCartActive}
                    focusRef={focusRef}
                    extraClassName={"verify"}
                />
                <LiveSearchResultContainer
                    virtualCart={virtualCart}
                    setVirtualCart={setVCart}
                    focusRef={focusRef}
                    result={queryResults}
                />
            </div>
            <VirtualCart
                isActive={isVirtualCartActive}
                items={vcart}
                setVirtualCart={setVCart}
            />
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