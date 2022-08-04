import React, { FC } from "react";
import { baseUrl } from "../../../App";
import { currency } from "../../../common/constants";
import { AdminProduct } from "../../../common/types";
import { adminActions, useAppDispatch, windowActions } from "../../../redux";
import { useAdminApi } from "../../../hooks/useAdminApi";

interface MPItemProps {
   product: AdminProduct;
   locallyApprove: (productId: number) => void;
}

const MPItem: FC<MPItemProps> = ({ product, locallyApprove }) => {
   const dispatch = useAppDispatch();
   const { approveProduct } = useAdminApi();

   async function handleApprove() {
      const ok = await approveProduct(product.id);
      if (ok) {
         //Change state if operation is ok
         locallyApprove(product.id);
      }
   }
   function toggleEditProductModal() {
      dispatch(windowActions.toggleProductModal());
      dispatch(adminActions.selectProduct(product));
   }

   return (
      <li className="mp_card" key={product.id}>
         <div className="mp_left">
            <img className="mp_image" src={`${baseUrl}/${product.id}.png`} alt="" />
            <div className="mp_content">
               <span>
                  <p className="mp_title">
                     {product.translate}&nbsp;<small>/</small>
                  </p>
               </span>
               <p className="mp_subtitle">{product.name}</p>
               <p className="mp_price">
                  {product.price} {currency}
               </p>
            </div>
         </div>
         <div className="mp_right">
            <section>
               <button className="mp_control">Подробнее</button>
               <button className="mp_control bot" onClick={toggleEditProductModal}>
                  Редактирование
               </button>
            </section>
            <section>
               <button onClick={handleApprove} disabled={product.approved} className={product.approved ? "mp_control end --green" : "mp_control end"}>
                  Показывать <br /> в каталоге
               </button>
               <button
                  onClick={handleApprove}
                  disabled={!product.approved}
                  className={!product.approved ? "mp_control bot end --red" : "mp_control bot end"}>
                  Скрыть <br /> из каталога
               </button>
            </section>
         </div>
      </li>
   );
};

export default MPItem;
