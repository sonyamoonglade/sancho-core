import React, { FC, useEffect, useRef, useState } from "react";
import PromotionCard from "./promotionCard/PromotionCard";
import "./promotion.styles.scss";
import { Promotion } from "../../../common/types";

interface promotionListProps {
   promotions: Promotion[];
}

type promMap = Map<number, boolean>;

const PromotionList: FC<promotionListProps> = ({ promotions }) => {
   const [touchedPromotions, setTouchedPromotions] = useState<promMap>(makeState());
   const animationRef = useRef<HTMLDivElement>(null);
   const [times, setTimes] = useState<number>(3);
   function makeState() {
      const m = new Map<number, boolean>();
      for (const promotion of promotions) {
         m.set(promotion.id, false);
      }
      return m;
   }

   function touch(product_id: number) {
      const m = new Map(touchedPromotions);
      const prev = m.get(product_id);
      m.set(product_id, !prev);
      setTouchedPromotions(() => m);
   }

   useEffect(() => {
      const i = setTimeout(startAnimation, 1000);

      return () => clearTimeout(i);
   }, []);
   const sleep = (dur: number) => new Promise((resolve) => setTimeout(resolve, dur));
   async function startAnimation() {
      for (let i = 0; i <= 30; i++) {
         await sleep(2);
         animationRef.current.scroll(i, 0);
      }
      await sleep(250);
      for (let i = 30; i >= 0; i--) {
         await sleep(2);
         animationRef.current.scroll(i, 0);
      }
   }

   return (
      <div className="promotion_list" ref={animationRef}>
         {promotions.map((p) => {
            const isTouched = touchedPromotions.get(p.id);
            return <PromotionCard promotion={p} key={p.id} touchFn={touch} isTouched={isTouched} />;
         })}
      </div>
   );
};

export default PromotionList;
