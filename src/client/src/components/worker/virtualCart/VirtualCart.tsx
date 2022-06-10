import React, {FC} from 'react';
import {DatabaseCartProduct} from "../../../common/types";
import "./virtual-cart.styles.scss"


interface virtualCartProps {
    isActive: boolean
    items: DatabaseCartProduct[]
}

const VirtualCart:FC<virtualCartProps> = ({isActive,items}) => {


    return (
        <div className={isActive ? "virtual_cart --virtual-active" : "virtual_cart"}>
            <ul className='virtual_list'>
                {items?.map((p:DatabaseCartProduct) => (
                    <li key={p.id}>
                        <div className='v_leading'>
                            {p.translate}
                            {p.category}
                        </div>
                        <div className="v_trailing">
                            {p.price}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VirtualCart;