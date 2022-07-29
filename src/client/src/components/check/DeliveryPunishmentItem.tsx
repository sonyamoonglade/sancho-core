import React from "react";
import { miscSelector, useAppSelector } from "../../redux";
import { currency } from "../../common/constants";

const DeliveryPunishmentItem = () => {
   const { DELIVERY_PUNISHMENT_VALUE: value, DELIVERY_PUNISHMENT_THRESHOLD: threshold } = useAppSelector(miscSelector);
   return (
      <>
         <li className="check_item">
            <p className="check_item_title">Оплата доставки</p>
            <p className="check_item_summary">
               {value}.0 * 1 = {value}.0
            </p>
         </li>
         <li className="check_item">
            <i className="delivery_hint">
               *Бесплатная доставка от {threshold}.0 {currency}
            </i>
         </li>
      </>
   );
};

export default DeliveryPunishmentItem;
