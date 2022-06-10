import React, {FC} from 'react';
import {Product} from "../../../common/types";


interface containerProps {
    result: Product[]
}

const LiveSearchResultContainer:FC<containerProps> = ({result}) => {
    return (
        <div className='live_search_result'>
            <p className='modal_title ls'>Результаты поиска</p>
            <ul>
                {result?.map(r => (
                    <li>
                        <div className="v_leading">
                            <p>
                                {r.translate}
                            </p>
                        </div>

                        <div className="v_trailing">
                            {r.price}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LiveSearchResultContainer;