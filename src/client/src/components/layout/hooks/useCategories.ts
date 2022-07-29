import { productActions, productSelector, useAppDispatch, useAppSelector } from "../../../redux";
import { useRef } from "react";

export function useCategories(catalogRef: any) {
   const { categories } = useAppSelector(productSelector);
   const dispatch = useAppDispatch();
   const adjm = useRef<Map<string, number>>(null);

   function fillUpAdj(): Map<string, number> {
      if (catalogRef.current !== null) {
         const m = new Map<string, number>();
         for (const cat of categories) {
            for (const child of catalogRef?.current.children) {
               if (cat.value === child.id) {
                  const bounds = (child as HTMLElement).getBoundingClientRect();
                  m.set(cat.value, Math.round(bounds.top));
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
   function findClosest(v: number): string {
      for (const [k, mv] of adjm.current.entries()) {
         const currCateg = categories.find((c) => c.active);
         if (v * 0.95 < mv && v * 1.05 > mv) {
            dispatch(productActions.activateCategory(k));
            break;
         } else if (v < adjm.current.get(currCateg.value)) {
            const currIdx = categories.findIndex((c) => c.active);
            if (currIdx > 0) {
               const next = categories[currIdx - 1];
               dispatch(productActions.activateCategory(next.value));
            }
         }
      }

      return "";
   }

   return { fillUpAdj, findClosest, adjm, categories };
}
