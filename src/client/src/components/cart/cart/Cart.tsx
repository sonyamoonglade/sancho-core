import React, {useEffect, useState} from 'react';
import {TiArrowBack} from 'react-icons/ti'
import './cart.styles.scss'
import {productSelector, useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../redux";
import {useCart} from "../../../hooks/useCart";
import CartItem from "../cartItem/CartItem";
import ExtraList from "../../extraList/ExtraList";
import {AiOutlineDelete} from 'react-icons/ai'
import {DatabaseCartProduct} from "../../../common/types";
import {useToast} from "../hooks/useToast";


const Cart = React.memo(() => {

    const {cart: cartModal} = useAppSelector(windowSelector)
    const {isCartEmpty, totalCartPrice} = useAppSelector(productSelector)
    const {
        toastMsgRef,
        toastRef,
        isActive,
        isClicked,
        notifyUser
    } = useToast()

    const dispatch = useAppDispatch()
    const cart = useCart()
    const [cartProducts,setCartProducts] = useState<DatabaseCartProduct[]>(cart.getCart())

    useEffect(() => {
        if(isCartEmpty){
            setCartProducts([])
        }
    },[isCartEmpty])
    useEffect(() => {
        setCartProducts(cart.getCart())
    },[totalCartPrice])
    useEffect(() => {
        const body = document.body
        if(cartModal){
            body.style.overflow = 'hidden'
        }else {
            body.style.overflow = 'visible'
        }
    },[cartModal])




    function toggleCart() {
        dispatch(windowActions.toggleCart())
    }


    return (
        <div className={cartModal ? 'cart modal modal--visible' : 'cart modal'}>

            <div className="cart_header">
                <TiArrowBack onClick={() => toggleCart()} className='cart_back_icon' size={30} />
                <p>Корзина</p>
                <div className='cart_info_container'>
                    {!isClicked && <div className="red_dot">&nbsp;</div>}
                    <AiOutlineDelete onClick={() => notifyUser()} className='cart_info_icon' size={28} />
                </div>

            </div>

            <ul className="cart_list">
                {cartProducts &&
                    cartProducts.map((p,i) => {
                        if(i === 0) return <CartItem product={p} key={p.id} isActive={isActive}/>
                        return  <CartItem key={p.id} product={p}/>
                    })}

            </ul>
            <div className="cart_extra">
                <div className="cart_extra_header">
                    <div ref={toastRef} className={isActive ? "toast --toast-active" : "toast"}>
                        <p ref={toastMsgRef} className='toast_message'>Нажмите на товар 2 раза, чтобы удалить его из корзины</p>
                    </div>
                    <p className="extra_title">Добавить к заказу</p>
                </div>
                <ExtraList updateCart={setCartProducts} />
            </div>

        </div>
    );

})
export default Cart;