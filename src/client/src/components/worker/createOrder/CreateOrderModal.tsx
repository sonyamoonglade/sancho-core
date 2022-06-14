import React, {useEffect, useState} from 'react';
import {
    useAppDispatch,
    useAppSelector,
    windowActions,
    windowSelector,
    workerActions,
    workerSelector
} from "../../../redux";
import "./create-order.styles.scss"
import CreateOrderForm from "./createForm/CreateOrderForm";
import {RiSettings4Line} from "react-icons/ri";
import VirtualCart from "../virtualCart/VirtualCart";
import {currency} from "../../../common/constants";
import {utils} from "../../../utils/util.functions";

const CreateOrderModal = () => {

    const {worker} = useAppSelector(windowSelector)
    const {virtualCart:virtualCartState} = useAppSelector(workerSelector)

    const dispatch = useAppDispatch()

    function toggleVirtualCart(){
        dispatch(windowActions.toggleVirtualCart())
    }

    async function handleOrderCreation(){
        return
    }

    const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0)



    useEffect(() => {
        const totalVcPrice = utils.getOrderTotalPrice(virtualCartState.items)
        setTotalOrderPrice(totalVcPrice)
    },[virtualCartState.items])

    return (
        <div className={worker.createOrder ? 'worker_modal create --w-opened' : 'worker_modal create'}>


        <p className='modal_title'>Создать заказ</p>
        <RiSettings4Line onClick={toggleVirtualCart} className='submit_settings' size={25}/>
        <VirtualCart/>
        <CreateOrderForm

        />


            <div className="verify_sum">
                <p>Сумма заказа </p>
                <p>{totalOrderPrice}.00 {currency}</p>
            </div>
            <button onClick={handleOrderCreation} className='modal_button'>Создать заказ</button>
        </div>
    );
};

export default CreateOrderModal;