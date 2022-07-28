import React, { FC } from "react";
import { usePaywaySelect } from "./hooks/usePaywaySelect";
import { Pay } from "../../../common/types";

interface PaywaySelectProps {
   payway: Pay;
   opt1: Pay;
   setPayway: Function;
   setFormValues: Function;
}

//Deprecated
//PaywaySelect
//Probably for further use
//Todo: delete

const PaywaySelect: FC<PaywaySelectProps> = ({ payway, setPayway, setFormValues, opt1 }) => {
   const { handlePayChange } = usePaywaySelect(setPayway, setFormValues);
   return (
      <div className="pay select_container">
         <p className="delivered_at_title w">Способ оплаты</p>
         <select value={payway} onChange={handlePayChange} className="delivered_at_select w">
            <option value={opt1}>{opt1 === "onPickup" && "При получении"}</option>
         </select>
      </div>
   );
};

export default PaywaySelect;
