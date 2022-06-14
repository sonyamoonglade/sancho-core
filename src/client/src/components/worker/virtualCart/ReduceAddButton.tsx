import React, {FC} from 'react';
import "./virtual-cart.styles.scss"
import {BsPlus} from 'react-icons/bs'
import {BiMinus} from 'react-icons/bi'
import {DatabaseCartProduct} from "../../../common/types";


interface reduceAddButtonProps {
    quantity: number
    add: Function
    dbProduct: DatabaseCartProduct
    reduce: Function
}

const ReduceAddButton:FC<reduceAddButtonProps> = ({quantity,add,reduce,dbProduct}) => {
    return (
        <div className='reduce_add_button'>
            <span className='virtual_icon'>
                <BiMinus onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    reduce(dbProduct.id)
                }} size={25} />
            </span>
            <p className='virtual_product_quantity'>
                {quantity}
            </p>
            <span className='virtual_icon'>
                <BsPlus onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    add(dbProduct)
                }} size={25} />
            </span>
        </div>
    );
};

export default ReduceAddButton;