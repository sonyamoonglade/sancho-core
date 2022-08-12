import React, { useEffect, useState } from "react";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { AggregationPreset, ProductTopArray } from "../../../common/types";
import "./product-top.styles.scss";

const ProductTop = () => {
   const { getProductTop } = useAdminApi();
   const [productTop, setProductTop] = useState<ProductTopArray>([]);
   const [aggregation, setAggregation] = useState(AggregationPreset.WEEK);
   const [showq, setShowq] = useState<[string, boolean][]>([]);
   async function fetchProductTopAsync() {
      const top = await getProductTop(aggregation);
      setProductTop(top);
   }
   function handleSelectChange(e: any) {
      const v = e.target.value;
      setAggregation(v);
   }

   function fillShowq() {
      if (productTop.length) {
         const arr: [string, boolean][] = [];
         for (const p of productTop) {
            arr.push([p.translate, false]);
         }
         setShowq(arr);
      }
   }

   useEffect(() => {
      fillShowq();
   }, [productTop]);

   function handleLeave(tr: string) {
      setShowq(
         showq.map((el) => {
            //Get translate of iterated [string,boolean]
            const prevtr = el[0];
            if (prevtr === tr) {
               return [tr, false];
            }
            return el;
         })
      );
   }

   function handleEnter(tr: string) {
      setShowq(
         showq.map((el) => {
            const prevtr = el[0];
            if (prevtr === tr) {
               return [tr, true];
            }
            return el;
         })
      );
   }

   function handleClose() {
      setProductTop([]);
   }

   function isItemShown(tr: string) {
      if (showq?.length === 0) {
         return false;
      }
      //Get the boolean key out
      return showq?.find((el) => el[0] === tr)[1];
   }

   return (
      <div className="product_top">
         <span className="product_heading">
            <div>
               <p className="top_title">Составить агрегацию</p>
               <span className="aggregation_select_container">
                  <p>Период:</p>
                  <select onChange={handleSelectChange} className="aggregation_select" value={aggregation}>
                     <option value={AggregationPreset.WEEK}>Неделя</option>
                     <option value={AggregationPreset.MONTH}>Месяц</option>
                     <option value={AggregationPreset.YEAR}>Год</option>
                  </select>
               </span>
            </div>
            <span>
               <button onClick={handleClose} className="product_top_request_btn">
                  Закрыть
               </button>
               <button onClick={fetchProductTopAsync} className="product_top_request_btn">
                  Запросить
               </button>
            </span>
         </span>
         <ul className="product_top_list">
            {productTop?.map((p) => (
               <li key={p.translate} style={{ width: `${p.percent}%` }} className="top_item">
                  {isItemShown(p.translate) && (
                     <div className="top_exactq">
                        <p>{p.exactq} шт</p>
                     </div>
                  )}
                  <p style={{ width: "min-content" }} onMouseLeave={() => handleLeave(p.translate)} onMouseEnter={() => handleEnter(p.translate)}>
                     {p.translate}
                  </p>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ProductTop;
