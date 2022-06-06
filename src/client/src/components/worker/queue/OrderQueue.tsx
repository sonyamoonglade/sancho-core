import React, {useEffect} from 'react';
import {useAxios} from "../../../hooks/useAxios";

interface ResponseOrderQueueInterface {
    queue: {
        verified: Order
    }
}

const OrderQueue = () => {

    const {client} = useAxios()

    useEffect(() => {

    },[])

    async function fetchOrderQueue(){
        const {data} = await client.get<>("/order/queue")

    }

    return (
        <div className='queue_container'>

            <div className="waiting queue_col">

            </div>

            <div className="submitted queue_col">

            </div>

        </div>
    );
};

export default OrderQueue;