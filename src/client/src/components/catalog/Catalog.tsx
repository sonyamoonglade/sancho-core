import React, {FC} from 'react';

import './catalog.styles.scss'
import ProductCard from "../product/productCard/ProductCard";
import {Product} from "../../common/types";

interface catalogProps {
    productList: Product[]

}

const Catalog:FC<catalogProps> = ({productList}) => {


    return (
        <ul className='catalog'>
            {productList.map((p) => (
                <ProductCard product={p} key={p.id} />
            ))}
        </ul>
    );
};

export default Catalog;