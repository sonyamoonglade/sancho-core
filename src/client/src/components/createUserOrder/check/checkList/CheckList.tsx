import React, { FC, useMemo } from "react";
import CheckItem from "./CheckItem";
import "../check.styles.scss";
import { DatabaseCartProduct } from "../../../../common/types";
import DeliveryPunishmentItem from "../DeliveryPunishmentItem";
import { miscSelector, useAppSelector } from "../../../../redux";

interface checkListProps {
   products: DatabaseCartProduct[];
   totalCartPrice: number;
   isDelivered: boolean;
}

const CheckList: FC<checkListProps> = ({ products, totalCartPrice, isDelivered }) => {
   const { DELIVERY_PUNISHMENT_THRESHOLD } = useAppSelector(miscSelector);
   const isPunished = useMemo(() => {
      return totalCartPrice <= DELIVERY_PUNISHMENT_THRESHOLD;
   }, [totalCartPrice]);

   return (
      <ul>
         {products.map((p) => (
            <CheckItem product={p} key={p.translate} />
         ))}
         {isPunished && isDelivered && <DeliveryPunishmentItem />}
      </ul>
   );
};

export default CheckList;
