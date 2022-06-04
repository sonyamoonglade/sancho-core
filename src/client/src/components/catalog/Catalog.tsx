import React, {FC} from 'react';

import './catalog.styles.scss'
import ProductCard from "../product/productCard/ProductCard";
import {Product} from "../../common/types";

interface catalogProps {
    productList: Product[]

}

const Catalog:FC<catalogProps> = ({productList}) => {


    return (
        <div className='catalog'>
            {productList.map((p) => (

               <>
                   <ProductCard product={p} key={p.id} />
                   <ProductCard product={p} key={p.id} />
                   <ProductCard product={p} key={p.id} />
               </>

            ))}
        </div>
    );
};

export default Catalog;