import React, { FC, useContext, useState } from "react";
import "./categories.styles.scss";
import { productActions, productSelector, useAppDispatch, useAppSelector } from "../../../redux";
import { LayoutContext } from "../context";

const Categories = () => {
   const { categories: list, categoriesScrollAdj: mapLikeObj } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();
   const { layoutRef } = useContext(LayoutContext);
   const [isScrolling, setIsScrolling] = useState(false);

   function activate(categ: string) {
      if (isScrolling) {
         return;
      }
      if (layoutRef.current !== null && mapLikeObj !== null) {
         const m: Map<string, number> = objToMap(mapLikeObj);
         const categScroll: number = m.get(categ);
         const finalScroll = categScroll - 120 - 16;
         smoothTo(layoutRef, finalScroll);
      }
   }

   function smoothTo(ref: any, v: number) {
      setIsScrolling(true);
      let curr: number = ref?.current.scrollTop;
      if (curr === 0) {
         curr = 80;
      }
      if (curr >= v) {
         const steps = 50;
         const interval = setInterval(() => {
            const perStep = curr / steps;

            if (curr <= v) {
               clearInterval(interval);
               setIsScrolling(false);
            }
            curr -= perStep;
            ref.current.scroll({ top: curr - perStep });
         }, 3);
      } else {
         const steps = 150;
         const interval = setInterval(() => {
            const perStep = curr / steps;

            if (curr >= v) {
               clearInterval(interval);
               setIsScrolling(false);
            }
            curr += perStep;
            ref.current.scroll({ top: curr + perStep });
         }, 3);
      }
   }

   function objToMap(v: object): Map<string, any> {
      return Object.entries(v).reduce((map, [k, v]) => {
         map.set(k, v);
         return map;
      }, new Map<string, any>());
   }

   return (
      <div className="categories">
         {list?.map((c) => (
            <div onClick={() => activate(c.value)} key={c.value} className={c.active ? "category_item --category-active" : "category_item"}>
               <p>{c.value}</p>
            </div>
         ))}
      </div>
   );
};

export default Categories;
