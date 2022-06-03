import React from 'react';
import "./d-cart-link.styles.scss"
import {BiShoppingBag} from "react-icons/bi";
import {productSelector, useAppDispatch, useAppSelector, windowActions} from "../../../redux";
import {currency} from "../../../common/constants";

const DesktopCartLink = () => {

    const {totalCartPrice} = useAppSelector(productSelector)
    const dispatch = useAppDispatch()
    function toggleCart(){
        dispatch(windowActions.toggleCart())
        dispatch(windowActions.turnOffAllDesktop())
    }

    return (


        <button className='d_cart_link' onClick={toggleCart}>
            <BiShoppingBag className='d_cart_link_icon' size={25} />
            <p>{totalCartPrice} {currency} </p>
            <p>&#8226;</p>
            <p className='pass'>Оформить</p>
        </button>
    );
};

export default DesktopCartLink;