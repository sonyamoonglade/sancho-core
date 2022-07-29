import React from "react";
import CompleteOrderDrag from "../../worker/drag/complete/CompleteOrderDrag";
import CancelOrderDrag from "../../worker/drag/cancel/CancelOrderDrag";
import VerifyOrderDrag from "../../worker/drag/verify/VerifyOrderDrag";

const Drags = () => {
   return (
      <>
         <CompleteOrderDrag />
         <CancelOrderDrag />
         <VerifyOrderDrag />
      </>
   );
};

export default Drags;
