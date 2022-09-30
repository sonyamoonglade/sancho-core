import React, { FC } from "react";

import "../layout/layout/layout.styles.scss";

import "./header.styles.scss";
import { useAppDispatch, useAppSelector, userSelector, windowSelector, windowSlice } from "../../redux";
import Cart from "../cart/cart/Cart";
import Order from "../createUserOrder/CreateUserOrder";
import Loading from "../loading/Loading";
import { Promotion } from "../../common/types";
import OrderHistory from "../orderHistory/OrderHistory";
import { RiCloseCircleLine } from "react-icons/ri";
import { CgMenuRound } from "react-icons/cg";
import { AppResponsiveState } from "../../types/types";
import DesktopHeaderRight from "../desktopHeader/DesktopHeaderRight";
import MasterLogin from "../masterLogin/MasterLogin";
import WorkerNavigation from "../worker/navigation/WorkerNavigation";
import WorkerNavigationRight from "../worker/navigation/WorkerNavigationRight";
import AdminNavigation from "../admin/navigation/AdminNavigation";
import Pay from "../pay/Pay";
import DesktopNavigation from "../navigation/other/DesktopNavigation";
import PromotionList from "../promotion/PromotionList";
import MobileNavigation from "../navigation/mobile/MobileNavigation";

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
                  <DesktopNavigation />
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
               <PromotionList />
               <Order />
               <Pay />
               <Cart />
               <OrderHistory />
               <MasterLogin />
               <Loading />
               {appResponsiveState === AppResponsiveState.mobileOrTablet && <MobileNavigation />}
            </>
         )}
      </header>
   );
};

export default React.memo(Header);
