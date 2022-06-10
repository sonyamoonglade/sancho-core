import React, {useState} from 'react';
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
        isSubmitButtonActive
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

    function toggleVirtualCart(){
        setIsVirtualCartActive(p => !p)
    }

    const {queryResults} = useAppSelector(workerSelector)

    const cart = useCart()
    return (
        <div className={worker.verifyOrder ? 'worker_modal --w-opened' : 'worker_modal'}>
            <p className='modal_title'>Подтвердить заказ</p>

            <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>


            <div className={isVirtualCartActive ? 'livesearch_container --ls-active' : "livesearch_container"}>
                <LifeSearch extraClassName={"verify"} />
            </div>
            <LiveSearchResultContainer isActive={isVirtualCartActive} result={queryResults}/>


            <VirtualCart isActive={isVirtualCartActive} items={cart.getCart()}/>
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

export default VerifyOrderModal;