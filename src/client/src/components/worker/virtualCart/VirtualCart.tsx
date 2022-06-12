import React, {FC} from 'react';
import {DatabaseCartProduct} from "../../../common/types";
import "./virtual-cart.styles.scss"
import "../worker-globals.scss"
import {currency} from "../../../common/constants";
import ReduceAddButton from "./ReduceAddButton";
import {useVirtualCart} from "../hooks/useVirtualCart";

interface virtualCartProps {
    isActive: boolean
    items: DatabaseCartProduct[]
    setVirtualCart: Function
}

const VirtualCart:FC<virtualCartProps> = ({isActive,items,setVirtualCart}) => {

    const virtualCart = useVirtualCart()


    function addQuantity(p: DatabaseCartProduct){
        virtualCart.addProduct(p)
        setVirtualCart(virtualCart.getCurrentCart())
    }

    function reduceQuantity(id: number){
        virtualCart.removeProduct(id)
        setVirtualCart(virtualCart.getCurrentCart())
    }

    return (
        <div className={isActive ? "virtual_cart --virtual-active" : "virtual_cart"}>
            <ul className='virtual_list'>
                {items?.map((r:DatabaseCartProduct) => (
                        <li key={r.id} className="virtual_item">
                            <div className="v_leading">
                                <p>
                                    {r.translate} <i>|</i>
                                </p>
                                <small>{r.category}</small>
                            </div>
                            <div className="v_trailing">
                                <p className='virtual_total_price'>{r.price * r.quantity}{currency}</p>
                                <ReduceAddButton quantity={r.quantity} dbProduct={r} add={addQuantity} reduce={reduceQuantity} />
                            </div>

                        </li>
                ))}
            </ul>
        </div>
    );
};

export default VirtualCart;