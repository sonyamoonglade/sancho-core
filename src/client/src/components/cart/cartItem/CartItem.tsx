import React, {FC, useEffect, useMemo, useRef} from 'react';

import './cart-item.styles.scss'
import {baseUrl} from "../../product/productPresentation/ProductPresentation";
import {DatabaseCartProduct} from "../../../common/types";
import {currency} from "../../../common/constants";
import {useCart} from "../../../hooks/useCart";
import {productActions, useAppDispatch} from "../../../redux";

interface cartItemProps {
    product: DatabaseCartProduct
    isActive?: boolean
}

const CartItem:FC<cartItemProps> = ({product, isActive}) => {

    const cart = useCart()
    const dispatch = useAppDispatch()
    const productImage = useMemo(() => {
        return `${baseUrl}/${product.id}.png    `
    },[product])

    function reduceProductQuantity(){
        const permission = window.confirm("Подтвердить удаление?")
        if(!permission) { return }
        const {id} = product
        cart.removeProduct(id)
        const newCartPrice = cart.calculateCartTotalPrice()
        dispatch(productActions.setTotalCartPrice(newCartPrice))
        if(newCartPrice === 0){
            dispatch(productActions.setCartEmpty(true))
        }
    }

    const animationRef = useRef<HTMLLIElement>(null)

    function animateBackground(){
        animationRef.current.classList.add("--green")
        setTimeout(() => {
            animationRef.current.classList.remove("--green")
        },1000)

    }

    useEffect(() => {
        let i: any;
        if(isActive){
            i = setInterval(() => {
                animateBackground()
            },2000)
        }else {
            clearInterval(i)
        }

        return () => clearInterval(i)
    },[isActive])

    return (
        <li ref={animationRef} className='cart_item' onClick={() => reduceProductQuantity()}>
            <div className="leading">
                <img className='cart_item_image' src={productImage} alt=""/>
                <div className="info">
                    <p className='cart_item_translate'>{product.translate}</p>
                    <p className='cart_item_price'>{product.price} {currency}</p>
                </div>
            </div>

            <div className='price_info'>
                <p className='cart_item_quantity'>
                    {product.quantity}
                    <i> шт</i>
                </p>
                <i className='quantity_price'>{product.quantity * product.price} {currency}</i>
            </div>

        </li>
    );
};

export default React.memo(CartItem);