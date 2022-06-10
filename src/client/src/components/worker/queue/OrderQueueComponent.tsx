import React, {useEffect} from 'react';
import {useAxios} from "../../../hooks/useAxios";
import OrderHistoryItem from "../../orderHistory/OrderHistoryItem";
import "./order-queue.styles.scss"
import {orderActions, orderSelector, useAppDispatch, useAppSelector} from "../../../redux";


const OrderQueueComponent = () => {

    const {client} = useAxios()
    const {orderQueue: queue} = useAppSelector(orderSelector)
    const dispatch = useAppDispatch()
    useEffect(() => {
        getInitialQueue()
        const s = startEventSourcing()


    },[])


    function startEventSourcing(){
        let s:EventSource;
        try {
            s = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/order/queue`,{
                withCredentials: true
            })
            s.onmessage = function (event){
                const data = JSON.parse(event.data)
                dispatch(orderActions.setOrderQueue(data?.queue))
            }
            s.onerror = function (ev){
                s.close()
            }
            return s
        }catch (e) {
            s?.close()
        }
    }

    async function getInitialQueue(){
        try {
            const {data} = await client.get("/order/initialQueue")
            dispatch(orderActions.setOrderQueue(data?.queue))
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