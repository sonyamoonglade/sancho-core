import React from "react";
import "../drag.styles.scss";
import { useDrop } from "react-dnd";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";

const CompleteOrderDrag = () => {
   const [{ didDrop }, drop] = useDrop(() => ({
      accept: "ORDER",
      collect: (mon) => ({
         didDrop: mon.didDrop()
      }),
      drop: () => ({
         zone: DropZones.COMPLETE
      })
   }));

   return (
      <div ref={drop} role={"finisher"} className="complete_order drag">
         <p className="drag_title">Готов</p>
         &nbsp;
      </div>
   );
};

export default React.memo(CompleteOrderDrag);
