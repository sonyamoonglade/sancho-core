import React, { FC } from "react";
import { useDeliveryTimeSelect } from "./hooks/useDeliveryTimeSelect";

interface deliveryTimeSelectProps {
   isDeliveryFormDisabledExpr: string;
   opt1: string;
   opt2: string;
   selectV: string;
   setSelectV: Function;
   formValues: any;
   prefix: string;
   setFormValues: Function;
}

const DeliveryTimeSelect: FC<deliveryTimeSelectProps> = ({
   isDeliveryFormDisabledExpr,
   opt1,
   opt2,
   formValues,
   selectV,
   setFormValues,
   setSelectV,
   prefix
}) => {
   const { handleSelectChange, handleTimeChange } = useDeliveryTimeSelect(setSelectV, setFormValues, opt1, opt2);

   return (
      <>
         <div className={`delivered_at select_container w ${isDeliveryFormDisabledExpr}`}>
            <p className="delivered_at_title w">Время доставки</p>
            <select value={selectV} onChange={handleSelectChange} className="delivered_at_select w">
               <option value={opt1}>{opt1}</option>
               <option value={opt2}>{opt2}</option>
            </select>
         </div>
         <div
            className={
               selectV === opt1 && formValues[`is_delivered${prefix}`].value
                  ? `exact_time_select_wrapper --exact-active`
                  : `exact_time_select_wrapper`
            }>
            <input
               value={formValues.delivered_at.value}
               onChange={handleTimeChange}
               className={`${isDeliveryFormDisabledExpr}exact_time_select`}
               type="datetime-local"
            />
         </div>
      </>
   );
};

export default DeliveryTimeSelect;
