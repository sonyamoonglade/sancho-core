import React, { useMemo } from "react";
import {
  productActions,
  productSelector,
  useAppDispatch,
  useAppSelector,
  windowActions,
  windowSelector,
} from "../../redux";
import { AppResponsiveState } from "../../types/types";

const AppForm = () => {
   const dispatch = useAppDispatch();
   const { isPresentingNow } = useAppSelector(productSelector);
   const { masterLogin, cart, userOrder, pay, orderHistory } = useAppSelector(windowSelector);
   const { appResponsiveState } = useAppSelector(windowSelector);

   function handleClick() {
      if (isPresentingNow) {
         dispatch(productActions.stopPresentation());
      }

      if (appResponsiveState === AppResponsiveState.computer) {
         dispatch(windowActions.closeAll());
      }
      if (masterLogin) {
         dispatch(windowActions.toggleMasterLogin(false));
      }
   }

   const isActive = useMemo(() => {
      if (appResponsiveState === AppResponsiveState.mobileOrTablet) {
         return isPresentingNow;
      }
      return isPresentingNow || masterLogin || cart || userOrder || pay || orderHistory;
   }, [appResponsiveState, isPresentingNow, masterLogin, cart, userOrder, pay, orderHistory]);
   return (
      <div onClick={() => handleClick()} className={isActive ? "app_form visible" : "app_form"}>
         <span></span>
      </div>
   );
};

export default AppForm;
