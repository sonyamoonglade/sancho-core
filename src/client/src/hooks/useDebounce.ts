import { useEffect, useState } from "react";

export function useDebounce(delta: number, req: any) {
   const [v, setV] = useState(req);

   useEffect(() => {
      const t = setTimeout(() => {
         setV(req);
      }, delta);

      return () => clearTimeout(t);
   }, [req]);

   return v;
}
