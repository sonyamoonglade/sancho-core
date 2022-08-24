import React, { useState } from "react";
import "./ios-toggle.styles.scss";
import { SubscribeHandler } from "../../../admin/subcriptionsTable/SubscriptionsTable";

interface IosToggleProps {
   handler: SubscribeHandler;
   checked: boolean;
}

const IosToggle = ({ handler, checked }: IosToggleProps) => {
   function handleChange() {
      handler(checked);
   }

   return (
      <div className="ios_toggle">
         <label className="ios-switch">
            <input checked={checked} onChange={handleChange} type="checkbox" />
            <i></i>
         </label>
      </div>
   );
};

export default IosToggle;
