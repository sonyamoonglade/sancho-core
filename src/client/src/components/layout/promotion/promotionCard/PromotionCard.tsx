import React, { FC } from "react";
import "../promotion.styles.scss";
import { Promotion } from "../../../../common/types";

interface promotionCardProps {
   promotion: Promotion;
   touchFn: Function;
   isTouched: boolean;
}

const PromotionCard: FC<promotionCardProps> = ({ promotion, touchFn, isTouched }) => {
   return (
      <div className={promotion.id === 2 ? "promotion_card --grey" : "promotion_card"} onClick={() => touchFn(promotion.id)}>
         <div className={isTouched ? "promotion_title_primary closed" : "promotion_title_primary"}>
            <p>{promotion.title}</p>
            {/*{imageUrl && <img src={imageUrl} alt="t"/>}*/}
         </div>

         <div className={!isTouched ? "promotion_title_primary closed" : "promotion_title_primary"}>
            <p>{promotion.touched_title}</p>
            <p className="promotion_description_touched">{promotion.touched_text}</p>
         </div>
      </div>
   );
};

export default PromotionCard;
