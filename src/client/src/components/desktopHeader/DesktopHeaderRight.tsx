import React from "react";
import DesktopCartLink from "../cart/desktopCartLink/DesktopCartLink";
import "./desktop-header.styles.scss";

import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch, windowActions } from "../../redux";

const DesktopHeaderRight = () => {
   const dispatch = useAppDispatch();

   function toggleMasterLogin() {
      dispatch(windowActions.toggleMasterLogin());
   }
   return (
      <div className="d_right_part">
         <DesktopCartLink />
         <FaUserCircle onClick={toggleMasterLogin} className="user_icon" size={35} />
      </div>
   );
};

export default DesktopHeaderRight;
