import React, { useEffect } from "react";
import "./master-login.styles.scss";
import { useAppDispatch, useAppSelector, userSelector, windowActions, windowSelector } from "../../redux";
import { AppResponsiveState, FormField } from "../../types/types";
import { TiArrowBack } from "react-icons/ti";
import MasterForm from "./form/MasterForm";

export interface MasterFormState {
   login: FormField;
   password: FormField;
}
export interface MasterFormValues {
   login: string;
   password: string;
}

const MasterLogin = () => {
   const dispatch = useAppDispatch();

   function toggleMasterLogin() {
      dispatch(windowActions.toggleMasterLogin());
   }

   const { masterLogin, appResponsiveState } = useAppSelector(windowSelector);
   const { isMasterAuthenticated } = useAppSelector(userSelector);
   useEffect(() => {
      if (masterLogin) {
         document.body.style.overflow = "hidden";
      } else document.body.style.overflow = "visible";
   }, [masterLogin]);

   return (
      <div className={masterLogin ? "master_login modal modal--visible" : "master_login modal"}>
         {appResponsiveState === AppResponsiveState.mobileOrTablet ? (
            <div className="master_login_header">
               <TiArrowBack onClick={toggleMasterLogin} className="cart_back_icon" size={30} />
               <div className="center_part">
                  <p>Вход в систему</p>
               </div>
            </div>
         ) : null}
         {isMasterAuthenticated ? null : <MasterForm appResponsiveState={appResponsiveState} />}
      </div>
   );
};

export default MasterLogin;
