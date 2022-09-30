import React, { FC } from "react";
import "../promotion.styles.scss";
import { Promotion } from "../../../common/types";
import { birthdayPromotion } from "../PromotionList";

interface promotionCardProps {
   promotion: Promotion;
   touchFn: Function;
   isTouched: boolean;
}

const PromotionCard: FC<promotionCardProps> = ({ promotion, touchFn, isTouched }) => {
   return (
      <div
         className={promotion.promotion_id === birthdayPromotion.promotion_id ? "promotion_card --grey" : "promotion_card"}
         onClick={() => touchFn(promotion.promotion_id)}>
         <div className={isTouched ? "promotion_title_primary closed" : "promotion_title_primary"}>
            <p>{promotion.main_title}</p>
         </div>

         <div className={!isTouched ? "promotion_title_primary closed" : "promotion_title_primary"}>
            <p>{promotion.sub_title}</p>
            <p className="promotion_description_touched">{promotion.sub_text}</p>
         </div>
      </div>
   );
};

export default PromotionCard;
