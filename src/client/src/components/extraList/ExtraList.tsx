import React, {FC} from 'react';

import './extra-list.styles.scss'
import ExtraItem from "./ExtraItem";
import {productSelector, useAppSelector} from "../../redux";

interface extraListProps{
    updateCart: Function
}

const ExtraList:FC<extraListProps> = ({updateCart}) => {
    const {productList} = useAppSelector(productSelector)
    return (
        <div className='cart_extra_list'>
            {productList.map((p) => (
                <ExtraItem key={p.id} updateCart={updateCart} product={p}/>
            )) }
        </div>
    );
};

export default ExtraList;