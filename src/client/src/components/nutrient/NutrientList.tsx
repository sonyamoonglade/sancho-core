import React, {FC} from 'react';
import './nutrient-list.styles.scss'
import {nutrients} from "../../common/types";

interface nutrientListProps {
    children?: any
    nutrients: nutrients
    isPresentingNow: boolean
}

const NutrientList:FC<nutrientListProps> = ({children,nutrients,isPresentingNow}) => {
    return (
        <ul className={isPresentingNow ? 'nutrients_list presentation' : 'nutrients_list'}>
            <li className='nutrient'><p>Жиры: {nutrients.fats}г</p></li>
            <li className='nutrient'><p>Углеводы: {nutrients.carbs}г</p></li>
            <li className='nutrient'><p>Белки: {nutrients.proteins}г</p></li>
            {children && children}
        </ul>
    );
};

export default NutrientList;