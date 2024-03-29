import React, { useEffect, useMemo, useRef } from "react";
import { DatabaseCartProduct } from "../../../common/types";
import "./virtual-cart.styles.scss";
import "../worker-globals.scss";
import { currency } from "../../../common/constants";
import ReduceAddButton from "./ReduceAddButton";
import { useVirtualCart } from "../hooks/useVirtualCart";
import { useAppDispatch, useAppSelector, windowSelector, workerActions, workerSelector } from "../../../redux";
import LifeSearch, { Livesearch } from "../liveSearch/LiveSearch";
import LiveSearchResultContainer from "../liveSearch/LiveSearchResultContainer";

const VirtualCart = () => {
   const virtualCart = useVirtualCart();
   const { productQueryResults, virtualCart: virtualCartState } = useAppSelector(workerSelector);
   const { worker } = useAppSelector(windowSelector);
   const focusRef = useRef<HTMLInputElement>(null);
   const dispatch = useAppDispatch();

   function addQuantity(p: DatabaseCartProduct) {
      virtualCart.addProduct(p);
      const cc = virtualCart.getCurrentCart();
      dispatch(workerActions.setVirtualCart(cc));
   }

   function reduceQuantity(id: number) {
      virtualCart.removeProduct(id);
      const cc = virtualCart.getCurrentCart();
      dispatch(workerActions.setVirtualCart(cc));
   }
   const onlyRussianLettersRegexp = useMemo(() => {
      return new RegExp("!?[0-9]+|!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+");
   }, []);

   useEffect(() => {
      if (!worker.virtualCart) {
         virtualCart.clearVirtualCart();
         dispatch(workerActions.setVirtualCart([]));
      }
   }, [worker.virtualCart]);

   return (
      <>
         <div className={worker.virtualCart ? "livesearch_container --ls-active " : "livesearch_container"}>
            <LifeSearch regexp={onlyRussianLettersRegexp} type={Livesearch.VIRTUAL_CART} focusRef={focusRef} extraClassName={"virtual_search"} />
            <LiveSearchResultContainer virtualCart={virtualCart} focusRef={focusRef} result={productQueryResults} />
         </div>
         <div className={worker.virtualCart ? "virtual_cart --virtual-active" : "virtual_cart"}>
            <ul className="virtual_list">
               {virtualCartState.items?.map((r: DatabaseCartProduct) => (
                  <li key={r.id} className="virtual_item">
                     <div className="v_leading">
                        <p>
                           {r.translate} <i>|</i>
                        </p>
                        <small>{r.category}</small>
                     </div>
                     <div className="v_trailing">
                        <p className="virtual_total_price">
                           {r.price * r.quantity}
                           {currency}
                        </p>
                        <ReduceAddButton dbProduct={r} add={addQuantity} reduce={reduceQuantity} />
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </>
   );
};

export default VirtualCart;
