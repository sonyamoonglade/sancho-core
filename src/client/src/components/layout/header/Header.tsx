import React, {FC} from 'react';

import PromotionList from "../promotion/PromotionList";
import '../layout/layout.styles.scss'

import './header.styles.scss'
import {useAppDispatch, useAppSelector, windowSelector, windowSlice} from "../../../redux";
import Navigation from "../navigation/mobile/Navigation";
import Cart from "../../cart/cart/Cart";
import Order from "../../order/userOrder/Order";
import Loading from "../../loading/Loading";
import {Promotion} from "../../../common/types";
import OrderHistory from "../../orderHistory/OrderHistory";
import {RiCloseCircleLine} from "react-icons/ri";
import {CgMenuRound} from "react-icons/cg";


const mockPromotions:Promotion[] = [
    {
        id:1,
        title:'Скидка 10% на доставку с понедельника по четверг',
        touched_text:'На все заказы, оформленные с понедельника по четверг с 11:00 до 16:00.',
        touched_title: 'Скидка 10% на доставку',
    },
    {
        id:2,
        title:'Акция!  2 пиццы по цене 3!',
        touched_text:'Акция действует с 25 мая по 31 июля. Успей получить халяву!',
        touched_title: 'Две по цене трех',
    },
    {
        id:3,
        title:'Акция!  2 пиццы по цене 3!',
        touched_text:'Акция действует с 25 мая по 31 июля. Успей получить халяву!',
        touched_title: 'Две по цене трех',
    }
]
const windowActions = windowSlice.actions


const Header:FC = () => {

    function nullifyScroll(){
        const steps = 50
        let i = 0;
        let interval = setInterval(() => {

            const currentScroll = window.scrollY
            const perStep = currentScroll / steps

            if(window.scrollY === 0) {
                clearInterval(interval)
            }
            window.scroll({top:currentScroll - perStep})
            i++
        },5)

    }

    const {navigation} = useAppSelector(windowSelector)
    const dispatch = useAppDispatch()

    function toggleMenu(){
        dispatch(windowActions.toggleNavigation())
    }



    return (
        <header>
            <div className='header_top'>
                <p onClick={nullifyScroll}><strong>Жар-Пицца</strong></p>
                {navigation ?
                    <RiCloseCircleLine onClick={toggleMenu} size={30} className='menu_close_icon' /> :
                    <CgMenuRound onClick={toggleMenu} size={30} />
                }
            </div>
            <PromotionList promotions={mockPromotions} />

            <Order  />
            <Cart />
            <OrderHistory />
            <Loading duration={4000} />
            <Navigation />


        </header>
    );
};

export default React.memo(Header);