import React, { FC, useEffect, useRef, useState } from "react";
import PromotionCard from "./promotionCard/PromotionCard";
import "./promotion.styles.scss";
import { useUserApi } from "../../hooks/useUserApi";
import { Promotion } from "../../common/types";

type promMap = Map<number, boolean>;
export const birthdayPromotion: Promotion = {
   promotion_id: 3,
   main_title: "Скидка 10% на день рождение!",
   sub_title: "Предоставим вам персональную скидку ",
   sub_text: "Только при предъявлении паспорта или свидетельства о рождении"
};

const PromotionList = () => {
   const { getPromotions } = useUserApi();
   const [promotions, setPromotions] = useState<Promotion[]>([]);
   const [touchedPromotions, setTouchedPromotions] = useState<promMap>(makeState());
   const animationRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      getPromotions().then((proms) => setPromotions(proms));
   }, []);

   function makeState() {
      const m = new Map<number, boolean>();
      for (const promotion of promotions) {
         m.set(promotion.promotion_id, false);
      }
      m.set(birthdayPromotion.promotion_id, false);
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

   function renderPromotions() {
      if (promotions.length === 0) {
         return;
      }

      const p1 = promotions[0];
      const p2 = promotions[1];

      return (
         <>
            <PromotionCard isTouched={touchedPromotions.get(p1.promotion_id)} promotion={p1} touchFn={touch} />
            <PromotionCard
               promotion={birthdayPromotion}
               touchFn={touch}
               isTouched={touchedPromotions.get(birthdayPromotion.promotion_id)}
            />
            <PromotionCard promotion={p2} touchFn={touch} isTouched={touchedPromotions.get(p2.promotion_id)} />
         </>
      );
   }

   return (
      <div className="promotion_list" ref={animationRef}>
         {renderPromotions()}
      </div>
   );
};

export default React.memo(PromotionList);
