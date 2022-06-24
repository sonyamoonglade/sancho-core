import React, { FC } from "react";
import { Product } from "../../../common/types";
import { currency } from "../../../common/constants";
import { VirtualCartInterface } from "../hooks/useVirtualCart";
import { useAppDispatch, workerActions } from "../../../redux";

interface containerProps {
   result: Product[];
   focusRef: any;
   virtualCart: VirtualCartInterface;
}

const LiveSearchResultContainer: FC<containerProps> = ({ result, focusRef, virtualCart }) => {
   const dispatch = useAppDispatch();

   function handleAddVirtualProduct(p: Product) {
      focusRef?.current.focus();
      virtualCart.addProduct(p);
      const cc = virtualCart.getCurrentCart();
      dispatch(workerActions.setVirtualCart(cc));
   }

   return (
      <div className={result?.length !== 0 ? "live_search_result --expanded" : "live_search_result"}>
         <ul className="virtual_list">
            {result?.map((r: Product) => (
               <li key={r.id} className="virtual_item">
                  <div className="v_leading">
                     <p>
                        {r.translate} <i>|</i>
                     </p>
                     <small>{r.category}</small>
                  </div>

                  <div className="v_trailing">
                     <button onClick={() => handleAddVirtualProduct(r)} className="ls_add_button">
                        Добавить
                     </button>
                     <p>
                        {r.price}
                        {currency}
                     </p>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default LiveSearchResultContainer;
