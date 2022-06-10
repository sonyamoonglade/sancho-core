import React, {FC} from 'react';
import {Product} from "../../../common/types";
import {currency} from "../../../common/constants";


interface containerProps {
    result: Product[]
    isActive: boolean
}

const LiveSearchResultContainer:FC<containerProps> = ({result,isActive}) => {
    return (
        <div className={isActive ? 'live_search_result --ls-active' : "live_search_result"}>
            <p className='modal_title ls'>Результаты поиска</p>
            <ul className='virtual_list'>
                {result?.map(r => (
                    <li className='virtual_item'>
                        <div className="v_leading">
                            <p>
                                {r.translate} <i>|</i>
                            </p>
                            <small>{r.category}</small>
                        </div>

                        <div className="v_trailing">
                            <button className='ls_add_button'>Добавить</button>
                            <p>{r.price}{currency}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LiveSearchResultContainer;