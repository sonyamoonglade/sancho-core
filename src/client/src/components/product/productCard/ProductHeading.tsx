import React, {FC} from 'react';
import {currency} from "../../../common/constants";
import {useMediaQuery} from "react-responsive";


interface productHeadingInterface {
    price: number
    translate: string
    name: string
    isTranslateShown: boolean
}


const ProductHeading:FC<productHeadingInterface> = ({price,translate, name,isTranslateShown}) => {


    return (
        <div className="title">
            <span>
                <p className="name">
                    {name}
                    {
                        isTranslateShown &&
                        <small> /</small>
                    }
                </p>
                {
                    isTranslateShown &&
                    <p className="translate">
                        {translate}
                    </p>
                }
            </span>
            <p className="price">{price} {currency}</p>
        </div>
    );
};

export default ProductHeading;