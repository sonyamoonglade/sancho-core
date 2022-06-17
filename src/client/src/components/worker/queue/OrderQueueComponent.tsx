import React, {useEffect} from 'react';
import {useAxios} from "../../../hooks/useAxios";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss"
import {useAppDispatch, useAppSelector, workerSelector} from "../../../redux";
import {getInitialQueue, startEventSourcingForQueue} from "../../../redux/worker/worker.async-actions";
import Error from "../error/Error";


const OrderQueueComponent = () => {

    const {client} = useAxios()
    const {orderQueue: queue} = useAppSelector(workerSelector)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getInitialQueue(client))
        dispatch(startEventSourcingForQueue())
    },[])

    useEffect(() => {
        document.body.style.overflowY = 'hidden'

        return () => {
            document.body.style.overflowY = "visible"
        }
    },[])


    return (
        <div className='queue_container'>

            <div className="waiting queue_col">
                <ul>
                    {queue?.waiting.map(wo => (
                        <OrderHistoryItem extraData={{
                            phoneNumber: wo.phone_number,
                        }} key={wo.id} order={wo} isFirstOrder={false} />
                    ))
                    }
                </ul>
            </div>
            <Error />
            <div className="verified queue_col">
                <ul>
                    {queue?.verified.map(vo => (
                            <OrderHistoryItem extraData={{
                                verifiedFullname: vo.verified_fullname,
                                phoneNumber: vo.phone_number
                            }} key={vo.id} order={vo} isFirstOrder={false} />
                        ))
                    }
                </ul>
            </div>

        </div>
    );
};

export default OrderQueueComponent;