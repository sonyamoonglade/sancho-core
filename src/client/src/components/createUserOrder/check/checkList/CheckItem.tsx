import React, { FC } from "react";

import "../check.styles.scss";
import { Categories, DatabaseCartProduct } from "../../../../common/types";

interface checkItemProps {
   product: DatabaseCartProduct;
}

const CheckItem: FC<checkItemProps> = ({ product: p }) => {
   return (
      <li className="check_item">
         <p className="check_item_title">
            {p.translate}
            {p.category === Categories.PIZZA && " пицца"}
         </p>
         <p className="check_item_summary">
            {p.price}.0 * {p.quantity} = {p.price * p.quantity}.0
         </p>
      </li>
   );
};

export default CheckItem;
