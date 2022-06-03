import React, {FC, useState} from 'react';
import PromotionCard from "./promotionCard/PromotionCard";
import './promotion.styles.scss'
import {Promotion} from "../../../common/types";

interface promotionListProps {
    promotions: Promotion[]
}

type promMap = Map<number, boolean>

const PromotionList:FC<promotionListProps> = ({promotions}) => {

    const [touchedPromotions,setTouchedPromotions] = useState<promMap>(makeState())

    function makeState(){
        const m = new Map<number,boolean>()
        for(const promotion of promotions){
            m.set(promotion.id,false)
        }
        return m
    }

    function touch(product_id: number){
        const m = new Map(touchedPromotions)
        const prev = m.get(product_id)
        m.set(product_id,!prev)
        setTouchedPromotions(() => m)
    }

    return (

            <ul className='promotion_list'>
                {promotions.map((p) => {
                    const isTouched = touchedPromotions.get(p.id)
                    return (
                        <PromotionCard promotion={p} key={p.id} touchFn={touch} isTouched={isTouched}/>
                    )
                })}
            </ul>

    );
};

export default PromotionList;