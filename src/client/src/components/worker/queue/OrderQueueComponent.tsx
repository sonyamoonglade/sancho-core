import React, {useEffect, useState} from 'react';
import {useAxios} from "../../../hooks/useAxios";
import {OrderQueue} from "../../../common/types";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss"
interface ResponseOrderQueueInterface {
    queue: {

    }
}

const OrderQueueComponent = () => {

    const {client} = useAxios()
    const [queue,setQueue] = useState<OrderQueue>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    useEffect(() => {
        fetchOrderQueue()
    },[])

    async function fetchOrderQueue(){
        setIsFetching(true)
        const {data} = await client.get("/order/queue")
        setQueue(data.queue)
        setIsFetching(false)
    }


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