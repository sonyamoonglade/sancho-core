import React, {FC, useEffect, useMemo, useState} from 'react';

import {baseUrl} from "../../product/productPresentation/ProductPresentation";
import {productSelector, useAppSelector} from "../../../redux";
import CheckList from "./checkList/CheckList";
import {CartInterface} from "../../../types/types";
import {DatabaseCartProduct} from "../../../common/types";
import {currency, DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE} from "../../../common/constants";

interface checkProps{
    cart: CartInterface
    isDelivered: boolean
}

const Check:FC<checkProps> = ({cart,isDelivered}) => {

    const [checkProducts, setCheckProducts] = useState<DatabaseCartProduct[]>(cart.getCart())
    const {totalCartPrice} = useAppSelector(productSelector)

    useEffect(() => {
        setCheckProducts(cart.getCart())
    },[totalCartPrice])


    const price = useMemo(() => {
       return cart.calculateCartTotalPrice()
    },[totalCartPrice])

    return (
        <div className='check_container'>
            <div className="check_content">
                <CheckList isDelivered={isDelivered} products={checkProducts} totalCartPrice={totalCartPrice} />
            </div>
            <div className="check_other">
                <div className='overall_check_price'>
                    <p>СУММА ЗАКАЗА</p>
                    <p>{(price <= DELIVERY_PUNISHMENT_THRESHOLD && isDelivered) ? price + DELIVERY_PUNISHMENT_VALUE : price}.00 {currency}</p>
                </div>
            </div>
            <img className="check" src={`${baseUrl}/check_icon.png`} alt="" />
        </div>
    );
};

export default Check;