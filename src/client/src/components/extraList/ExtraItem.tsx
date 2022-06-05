import React, {FC, useMemo} from 'react';

import './extra-list.styles.scss'
import {useCart} from "../../hooks/useCart";
import {productActions, useAppDispatch} from "../../redux";
import {baseUrl} from "../product/productPresentation/ProductPresentation";
import {DatabaseCartProduct, Product} from "../../common/types";
import {currency} from "../../common/constants";


interface extraItemProps {
    product: Product
    updateCart: Function
}

const ExtraItem:FC<extraItemProps> = ({product,updateCart}) => {

    const imageUrl = useMemo(() => {
        return `${baseUrl}/${product.id}.png`
    },[product])

    const cart = useCart()
    const dispatch = useAppDispatch()

    function addItemToCart(){
        const {price,id,translate,} = product
        const p:DatabaseCartProduct = {
            category:product.category,
            quantity:1,
            translate,
            price,
            id
        }
        cart.addProduct(p)
        dispatch(productActions.setTotalCartPrice(cart.calculateCartTotalPrice()))
        updateCart(cart.getCart())
    }

    return (
        <div onClick={() => addItemToCart()} className='extra_item'>
            <div className="item_top">
                <img className='item_image' src={imageUrl} alt="item"/>
                <p className='item_name'>{product.translate}</p>
            </div>
            <div className="item_bottom">
                <p className='item_other'>
                    {(product.features.volume !== undefined ) ?
                        `${product.features.volume} мл.` :
                        `${product.features.weight} г.`
                    }
                </p>
                <p className='item_price'>+{product.price} {currency}</p>
            </div>
        </div>
    );
};

export default ExtraItem;