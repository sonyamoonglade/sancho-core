import React, {FC} from 'react';
import {currency} from "../../../common/constants";


interface productHeadingInterface {
    price: number
    translate: string
    name: string
}


const ProductHeading:FC<productHeadingInterface> = ({price,translate, name}) => {
    return (
        <div className="title">
            <span>
                <p className="name">
                    {name}
                    <small> /</small>
                </p>
                <p className="translate">
                    {translate}
                </p>
            </span>
            <p className="price">{price} {currency}</p>
        </div>
    );
};

export default ProductHeading;