import React from "react";
import { miscSelector, useAppSelector } from "../../../redux";

const DeliveryPunishmentItem = () => {
   const { DELIVERY_PUNISHMENT_VALUE: value } = useAppSelector(miscSelector);

   return (
      <li className="check_item">
         <p className="check_item_title">Оплата доставки</p>
         <p className="check_item_summary">
            {value}.0 * 1 = {value}.0
         </p>
      </li>
   );
};

export default DeliveryPunishmentItem;
