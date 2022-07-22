import React, { FC } from "react";

import PromotionList from "../promotion/PromotionList";
import "../layout/layout.styles.scss";

import "./header.styles.scss";
import { useAppDispatch, useAppSelector, userSelector, windowSelector, windowSlice } from "../../../redux";
import MobileNavigation from "../navigation/mobile/MobileNavigation";
import Cart from "../../cart/cart/Cart";
import Order from "../../createUserOrder/Order";
import Loading from "../../loading/Loading";
import { Promotion } from "../../../common/types";
import OrderHistory from "../../orderHistory/OrderHistory";
import { RiCloseCircleLine } from "react-icons/ri";
import { CgMenuRound } from "react-icons/cg";
import { AppResponsiveState } from "../../../types/types";
import OtherNavigation from "../navigation/other/OtherNavigation";
import DesktopHeaderRight from "../desktopHeader/DesktopHeaderRight";
import MasterLogin from "../../masterLogin/MasterLogin";
import WorkerNavigation from "../../worker/navigation/WorkerNavigation";
import WorkerNavigationRight from "../../worker/navigation/WorkerNavigationRight";
import AdminNavigation from "../../admin/navigation/AdminNavigation";
import Categories from "../categories/Categories";
import Pay from "../../pay/Pay";

const mockPromotions: Promotion[] = [
   {
      id: 1,
      title: "Скидка 10% на доставку с понедельника по четверг",
      touched_text: "На все заказы, оформленные с понедельника по четверг с 11:00 до 16:00.",
      touched_title: "Скидка 10% на доставку"
   },
   {
      id: 2,
      title: "Акция!  2 пиццы по цене 3!",
      touched_text: "Акция действует с 25 мая по 31 июля. Успей получить халяву!",
      touched_title: "Две по цене трех"
   },
   {
      id: 3,
      title: "Акция!  2 пиццы по цене 3!",
      touched_text: "Акция действует с 25 мая по 31 июля. Успей получить халяву!",
      touched_title: "Две по цене трех"
   }
];
const windowActions = windowSlice.actions;

const Header: FC = () => {
   function nullifyScroll() {
      const steps = 50;
      let interval = setInterval(() => {
         const currentScroll = window.scrollY;
         const perStep = currentScroll / steps;

         if (window.scrollY === 0) {
            clearInterval(interval);
         }
         window.scroll({ top: currentScroll - perStep });
      }, 5);
   }

   const { navigation, appResponsiveState } = useAppSelector(windowSelector);
   const { isWorkerAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const dispatch = useAppDispatch();
   function toggleMenu() {
      dispatch(windowActions.toggleNavigation());
   }

   return (
      <header style={isWorkerAuthenticated || isMasterAuthenticated ? { height: 80 } : { height: 264 }}>
         <div className="header_top">
            <p className="app_title" onClick={nullifyScroll}>
               Сан-чо
            </p>

            {appResponsiveState === AppResponsiveState.mobileOrTablet ? (
               navigation ? (
                  <RiCloseCircleLine onClick={toggleMenu} size={30} className="menu_close_icon" />
               ) : (
                  <CgMenuRound onClick={toggleMenu} size={30} />
               )
            ) : null}

            {appResponsiveState === AppResponsiveState.computer && !isWorkerAuthenticated && !isMasterAuthenticated ? (
               <>
                  <OtherNavigation />
                  <DesktopHeaderRight />
               </>
            ) : appResponsiveState === AppResponsiveState.computer && isWorkerAuthenticated ? (
               <>
                  <WorkerNavigation />
                  <WorkerNavigationRight />
               </>
            ) : appResponsiveState === AppResponsiveState.computer && isMasterAuthenticated ? (
               <>
                  <AdminNavigation />
                  <WorkerNavigationRight />
               </>
            ) : null}
         </div>

         {isWorkerAuthenticated || isMasterAuthenticated ? null : (
            <>
               <PromotionList promotions={mockPromotions} />
               <Order />
               <Pay />
               <Cart />
               <OrderHistory />
               <MasterLogin />
               <Loading duration={4000} />
               {appResponsiveState === AppResponsiveState.mobileOrTablet && <MobileNavigation />}
            </>
         )}
      </header>
   );
};

export default React.memo(Header);
