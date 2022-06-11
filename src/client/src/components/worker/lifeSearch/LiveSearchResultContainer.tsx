import React, {FC} from 'react';
import {Product} from "../../../common/types";
import {currency} from "../../../common/constants";


interface containerProps {
    result: Product[]
    focusRef: any
}

const LiveSearchResultContainer:FC<containerProps> = ({result,focusRef}) => {

    function handleAddVirtualProduct(){

        focusRef?.current.focus()

        //logic
    }

    return (
        <div className={result.length !== 0 ? 'live_search_result --expanded' : "live_search_result"} >
            <ul className='virtual_list'>
                {result?.map(r => (
                    <li key={r.id} className='virtual_item'>
                        <div className="v_leading">
                            <p>
                                {r.translate} <i>|</i>
                            </p>
                            <small>{r.category}</small>
                        </div>

                        <div className="v_trailing">
                            <button onClick={handleAddVirtualProduct} className='ls_add_button'>Добавить</button>
                            <p>{r.price}{currency}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LiveSearchResultContainer;