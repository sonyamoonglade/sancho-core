import { productActions, productSelector, useAppDispatch, useAppSelector } from "../../../redux";
import { useRef } from "react";

export function useCategories(catalogRef: any) {
   const { categories } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();
   const adjm = useRef<Map<string, number>>(null);
   function fillUpAdj(): Map<string, number> {
      if (catalogRef.current !== null) {
         const m = new Map<string, number>();
         for (const [i, cat] of categories.entries()) {
            //Catalog items
            const children = catalogRef?.current.children;
            for (const child of children) {
               if (cat.value === child.id) {
                  const bounds = (child as HTMLElement).getBoundingClientRect();
                  let scrollv = Math.round(bounds.top);
                  //Compare calculated scroll value with previous category in the map
                  if (i !== 0 && scrollv === m.get(categories[i - 1].value)) {
                     //Increase scroll value by 10% to prevent identic scroll values in the map
                     scrollv = scrollv * 1.1;
                  }
                  //Put it
                  m.set(cat.value, scrollv);
               }
            }
         }
         adjm.current = m;
         const mapLikeObj = mapToObj(m);
         dispatch(productActions.setCategoriesAdj(JSON.stringify(mapLikeObj)));
         return m;
      }
      return null;
   }
   function mapToObj(m: Map<string, any>): object {
      return Array.from(m).reduce((out, [k, v]) => {
         out[k] = v;
         return out;
      }, {} as any);
   }
   function findClosest(v: number): void {
      for (const [k, mv] of adjm.current.entries()) {
         const currCateg = categories.find((c) => c.active);
         //Find the closest category by scroll value and activate it
         if (v * 0.95 < mv && v * 1.05 > mv) {
            if (currCateg.value === k) {
               break;
            }
            dispatch(productActions.activateCategory(k));
            break;
         }
      }
   }

   return { fillUpAdj, findClosest, adjm, categories };
}
