import {DatabaseCartProduct} from "../common/types";


export const utils = {
    getOrderTotalPrice: function (vcart: DatabaseCartProduct[]){
        return vcart.reduce((a,c) => {
            a += c.price * c.quantity
            return a
        },0)
    }
}