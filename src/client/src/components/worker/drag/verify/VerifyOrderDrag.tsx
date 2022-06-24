import React from "react";
import { useDrop } from "react-dnd";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";

const VerifyOrderDrag = () => {
   const [{ didDrop }, drop] = useDrop(() => ({
      accept: "ORDER",
      collect: (mon) => ({
         didDrop: mon.didDrop()
      }),
      drop: () => ({
         zone: DropZones.VERIFY
      })
   }));

   return (
      <div ref={drop} role={"verifier"} className="verify_order drag">
         <p className="drag_title">Подтвердить</p>
         &nbsp;
      </div>
   );
};

export default VerifyOrderDrag;
