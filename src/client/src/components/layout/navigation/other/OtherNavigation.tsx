import React from 'react';
import './other-nav.styles.scss'
import {useAppSelector, windowSelector} from "../../../../redux";
const OtherNavigation = () => {

    const {} = useAppSelector(windowSelector)


    return (
        <ul className='desktop_nav'>
            <li className="d_nav_item">
               Меню
            </li>
            <li className="d_nav_item">
                О нас
            </li>
            <li className="d_nav_item">
                Больше информации
            </li>

        </ul>
    );
};

export default OtherNavigation;