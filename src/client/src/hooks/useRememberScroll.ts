import { useEffect } from "react";

export function useRememberScroll() {
   const key = "scroll";

   useEffect(() => {
      const v = localStorage.getItem(key);
      if (!v) {
         //Set zero value
         localStorage.setItem(key, String(0));
         return;
      }
   }, []);

   function rememberScroll(v: number): void {
      localStorage.setItem(key, String(v));
   }

   function getScroll(): number {
      const v = localStorage.getItem(key);
      const scroll = parseInt(v);
      if (Number.isNaN(scroll)) {
         return 0;
      }
      return scroll;
   }
   return { getScroll, rememberScroll };
}
