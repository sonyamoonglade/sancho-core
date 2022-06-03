import React, {FC, useMemo} from 'react';
import CheckItem from "./CheckItem";

import '../check.styles.scss'
import {DatabaseCartProduct} from "../../../../common/types";

interface checkListProps {
    products: DatabaseCartProduct[]
    totalCartPrice: number

}

const CheckList:FC<checkListProps> = ({products,totalCartPrice}) => {


    const isPunished = useMemo(() => {
        // if(totalCartPrice > )
    },[totalCartPrice])


    return (
        <ul>
            {products.map(p => (
                <CheckItem product={p} key={p.translate} />
            ))

            }
        </ul>
    );
};

export default CheckList;