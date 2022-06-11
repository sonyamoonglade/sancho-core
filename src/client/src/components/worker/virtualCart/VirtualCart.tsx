import React, {FC} from 'react';
import {DatabaseCartProduct} from "../../../common/types";
import "./virtual-cart.styles.scss"
import "../worker-globals.scss"
import {currency} from "../../../common/constants";

interface virtualCartProps {
    isActive: boolean
    items: DatabaseCartProduct[]
}

const VirtualCart:FC<virtualCartProps> = ({isActive,items}) => {


    return (
        <div className={isActive ? "virtual_cart --virtual-active" : "virtual_cart"}>
            <ul className='virtual_list'>
                {items?.map((r:DatabaseCartProduct) => (
                    <>
                        <li key={r.id} className="virtual_item">
                            <div className="v_leading">
                                <p>
                                    {r.translate} <i>|</i>
                                </p>
                                <small>{r.category}</small>
                            </div>
                            <div className="v_trailing">
                                {/*change to total r.price * quant!! easy*/}
                                <p>{r.price}{currency}</p>
                            </div>
                            {/*    + N - button goes here*/}
                        </li>
                        <li key={r.id} className="virtual_item">
                            <div className="v_leading">
                                <p>
                                    {r.translate} <i>|</i>
                                </p>
                                <small>{r.category}</small>
                            </div>
                            <div className="v_trailing">
                                {/*change to total r.price * quant!! easy*/}
                                <p>{r.price}{currency}</p>
                            </div>
                            {/*    + N - button goes here*/}
                        </li>
                        <li key={r.id} className="virtual_item">
                            <div className="v_leading">
                                <p>
                                    {r.translate} <i>|</i>
                                </p>
                                <small>{r.category}</small>
                            </div>
                            <div className="v_trailing">
                                {/*change to total r.price * quant!! easy*/}
                                <p>{r.price}{currency}</p>
                            </div>
                            {/*    + N - button goes here*/}
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
};

export default VirtualCart;