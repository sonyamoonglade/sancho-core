import React, { FC } from "react";
import "./virtual-cart.styles.scss";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import { DatabaseCartProduct } from "../../../common/types";
import { useAppSelector, windowSelector } from "../../../redux";
import { AppResponsiveState } from "../../../types/types";

interface reduceAddButtonProps {
   add: Function;
   dbProduct: DatabaseCartProduct;
   reduce: Function;
}

const ReduceAddButton: FC<reduceAddButtonProps> = ({ add, reduce, dbProduct }) => {
   const { appResponsiveState } = useAppSelector(windowSelector);
   return (
      <div className="reduce_add_button">
         <span className="virtual_icon">
            <BiMinus
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  reduce(dbProduct.id);
               }}
               size={appResponsiveState === AppResponsiveState.mobileOrTablet ? 25 : 35}
            />
         </span>
         <p className="virtual_product_quantity">{dbProduct.quantity}</p>
         <span className="virtual_icon">
            <BsPlus
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  add(dbProduct);
               }}
               size={appResponsiveState === AppResponsiveState.mobileOrTablet ? 25 : 35}
            />
         </span>
      </div>
   );
};

export default ReduceAddButton;
