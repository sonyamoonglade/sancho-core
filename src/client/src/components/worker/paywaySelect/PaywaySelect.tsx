import React, { FC } from "react";
import { usePaywaySelect } from "./hooks/usePaywaySelect";
import { Pay } from "../../../common/types";

interface PaywaySelectProps {
   payway: Pay;

   setPayway: Function;
   setFormValues: Function;
}

const PaywaySelect: FC<PaywaySelectProps> = ({ payway, setPayway, setFormValues }) => {
   const { handlePayChange } = usePaywaySelect(setPayway, setFormValues);
   return (
      <div className="pay select_container">
         <p className="delivered_at_title w">Способ оплаты</p>
         <select value={payway} onChange={handlePayChange} className="delivered_at_select w">
            <option value={"withCardRunner"}>картой курьеру</option>
            <option value={"cash"}>наличными курьеру</option>
         </select>
      </div>
   );
};

export default PaywaySelect;
