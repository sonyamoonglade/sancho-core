import React from "react";
import CompleteOrderDrag from "../../worker/drag/complete/CompleteOrderDrag";
import CancelOrderDrag from "../../worker/drag/cancel/CancelOrderDrag";

const Drags = () => {
   return (
      <>
         <CompleteOrderDrag />
         <CancelOrderDrag />
      </>
   );
};

export default Drags;
