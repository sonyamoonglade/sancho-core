import React, {FC} from 'react';
import CheckItem from "./CheckItem";

import '../check.styles.scss'
import {DatabaseCartProduct} from "../../../../common/types";

interface checkListProps {
    products: DatabaseCartProduct[]
}

const CheckList:FC<checkListProps> = ({products}) => {

    return (
        <ul>
            {products.map(p => (
                <CheckItem product={p} key={p.translate} />
            ))}
        </ul>
    );
};

export default CheckList;