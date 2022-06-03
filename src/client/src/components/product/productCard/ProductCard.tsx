import React, {FC} from 'react';

import './product-card.styles.scss'
import ProductHeading from "./ProductHeading";
import ProductInfo from "./ProductInfo";
import {Product} from "../../../common/types";

interface productCardProps {
    product: Product
}


const ProductCard:FC<productCardProps> = ({product}) => {
    return (
        <li className='product_card'>
            <ProductHeading
               name={product.translate}
               translate={product.name}
               price={product.price}
            />
            <ProductInfo
               product={product}
            />
        </li>
    );
};

export default ProductCard;