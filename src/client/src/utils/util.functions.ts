import {DatabaseCartProduct, OrderQueue, WaitingQueueOrder} from "../common/types";


export const utils = {
    getOrderTotalPrice: function (vcart: DatabaseCartProduct[]){
        return vcart.reduce((a,c) => {
            a += c.price * c.quantity
            return a
        },0)
    },
    findOrderInWaitingQ: function (q:OrderQueue,orderId: number):WaitingQueueOrder{
        return q.waiting.find(o => {
            return o.id === orderId
        })
    },

    getOrderTotalPriceByCart: function (cart: DatabaseCartProduct[]){
        if(!cart) return 0
        const copy = [...cart].map((item: any) => JSON.parse(item))
        return copy.reduce((a,c) => {
            a += c.price * c.quantity
            return a
        },0)
    }

}