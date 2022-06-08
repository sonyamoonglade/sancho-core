import React, {useEffect, useState} from 'react';
import {useAxios} from "../../../hooks/useAxios";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss"
import {fetchOrderQueue, orderSelector, useAppDispatch, useAppSelector} from "../../../redux";
import {OrderQueue} from "../../../common/types";
interface ResponseOrderQueueInterface {
    queue: {

    }
}



const OrderQueueComponent = () => {

    const {client} = useAxios()
    const [queue, setQueue] = useState<OrderQueue>(null)


    useEffect(() => {
        getInitialQueue()
        const s = startEventSourcing()

        return () => s.close()
    },[])


    function startEventSourcing(){
        let s:EventSource;
        try {
            s = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/order/queue`,{
                withCredentials: true
            })
            s.onmessage = function (event){
                const data = JSON.parse(event.data)
                setQueue(data.queue)
            }
            return s
        }catch (e) {
            alert(e)
            s?.close()
        }
    }

    async function getInitialQueue(){
        try {
            const {data} = await client.get("/order/initialQueue")
            setQueue(data?.queue)
        }catch (e) {
            console.log(e)
            alert(e)
        }
    }




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