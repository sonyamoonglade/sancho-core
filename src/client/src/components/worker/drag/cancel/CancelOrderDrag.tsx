import React from "react";
import { useDrop } from "react-dnd";
import "../drag.styles.scss";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";

const CancelOrderDrag = () => {
   const [{ didDrop }, drop] = useDrop(() => ({
      accept: "ORDER",
      collect: (mon) => ({
         didDrop: mon.didDrop()
      }),
      drop: () => ({
         zone: DropZones.CANCEL
      })
   }));

   return (
      <div ref={drop} role={"canceller"} className="cancel_order drag">
         <p className="drag_title --no-reverse">Отменить</p>
         &nbsp;
      </div>
   );
};

export default CancelOrderDrag;
