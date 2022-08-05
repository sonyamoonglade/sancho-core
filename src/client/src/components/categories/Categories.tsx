import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./categories.styles.scss";
import { productActions, productSelector, useAppDispatch, useAppSelector, userSelector, windowSelector } from "../../redux";
import { LayoutContext } from "../layout/context";

const Categories = () => {
   const { categories: list, categoriesScrollAdj: mapLikeObj } = useAppSelector(productSelector);
   const { layoutRef } = useContext(LayoutContext);
   const { isAuthenticated } = useAppSelector(userSelector);
   const { appResponsiveState } = useAppSelector(windowSelector);
   const categRef = useRef(null);
   useEffect(() => {
      //Make Categories position property 'top' = 0 after certain scroll
      //1550px is breakpoint for @media query in stylesheet
      if (layoutRef.current.offsetWidth > 1550 && isAuthenticated) {
         layoutRef.current.onscroll = function () {
            const curr = layoutRef.current.scrollTop;
            if (curr >= 220) {
               categRef.current.style.top = "80px";
            } else {
               categRef.current.style.top = "280px";
            }
         };
      }
   }, [layoutRef, layoutRef.current, appResponsiveState, layoutRef?.current?.offsetWidth, isAuthenticated]);

   function activate(categ: string) {
      if (layoutRef.current !== null && mapLikeObj !== null) {
         const m: Map<string, number> = objToMap(mapLikeObj);
         const categScroll: number = m.get(categ);
         //120 - 16 is approx height of box
         let finalScroll = categScroll - 120 - 16;
         scrollTo(layoutRef.current, finalScroll);
      }
   }

   function scrollTo(element: HTMLElement, v: number) {
      element.scrollTo({ behavior: "smooth", top: v });
   }

   function objToMap(v: object): Map<string, any> {
      return Object.entries(v).reduce((map, [k, v]) => {
         map.set(k, v);
         return map;
      }, new Map<string, any>());
   }

   return (
      <div className="categories" ref={categRef}>
         {list?.map((c, i) => (
            <div onClick={() => activate(c.value)} key={c.value} className={c.active ? "category_item --category-active" : "category_item"}>
               <p>{c.value}</p>
            </div>
         ))}
      </div>
   );
};

export default Categories;
