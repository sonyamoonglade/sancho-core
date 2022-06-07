import React, {useEffect, useState} from 'react';
import {useAxios} from "../../../hooks/useAxios";
import {OrderQueue} from "../../../common/types";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss"
import {fetchOrderQueue, orderSelector, useAppDispatch, useAppSelector} from "../../../redux";
interface ResponseOrderQueueInterface {
    queue: {

    }
}

const OrderQueueComponent = () => {

    const {client} = useAxios()
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const {orderQueue: queue} = useAppSelector(orderSelector);


    useEffect(() => {
            dispatch(fetchOrderQueue(client,setIsFetching))
    },[])






    return (
        <div className='queue_container'>

            <div className="waiting queue_col">
                <ul>
                    {isFetching ?
                        <p>Загружаем очередь...</p> :
                        (queue && queue.waiting.map(wo => (
                        <OrderHistoryItem extraData={{
                            phoneNumber: wo.phone_number,
                        }} key={wo.id} order={wo} isFirstOrder={false} />
                    )))
                    }

                </ul>
            </div>

            <div className="verified queue_col">
                <ul>
                    {isFetching ?
                        <p>Загружаем очередь...</p> :
                        (queue && queue.verified.map(vo => (
                            <OrderHistoryItem extraData={{
                                verifiedFullname: vo.verified_fullname,
                                phoneNumber: vo.phone_number
                            }} key={vo.id} order={vo} isFirstOrder={false} />
                        )))
                    }
                </ul>
            </div>

        </div>
    );
};

export default OrderQueueComponent;