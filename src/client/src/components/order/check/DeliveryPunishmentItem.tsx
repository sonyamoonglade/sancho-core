import React from 'react';
import {DELIVERY_PUNISHMENT_VALUE} from "../../../common/constants";

const DeliveryPunishmentItem = () => {

    const value = DELIVERY_PUNISHMENT_VALUE

    return (
        <li className='check_item'>
            <p className='check_item_title'>
                Оплата доставки
            </p>
            <p className='check_item_summary'>{value}.0 * 1 = {value}.0</p>
        </li>
    );
};

export default DeliveryPunishmentItem;