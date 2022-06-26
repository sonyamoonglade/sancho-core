import React from "react";
import { useAppSelector, windowSelector } from "../../../../redux";

const CancelList = () => {
   const { worker } = useAppSelector(windowSelector);
   return (
      <div className={worker.cancelList ? "order_list cancel --olist-open" : "order_list"}>
         <p></p>
      </div>
   );
};

export default CancelList;
