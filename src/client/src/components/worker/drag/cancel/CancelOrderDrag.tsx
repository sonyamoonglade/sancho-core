import React from "react";
import { useDrop } from "react-dnd";
import "../drag.styles.scss";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";
import { useAppDispatch, windowActions } from "../../../../redux";

const CancelOrderDrag = () => {
   const [{}, drop] = useDrop(() => ({
      accept: "ORDER",
      collect: (mon) => ({
         didDrop: mon.didDrop()
      }),
      drop: () => ({
         zone: DropZones.CANCEL
      })
   }));
   const dispatch = useAppDispatch();

   function toggleCancelList() {
      dispatch(windowActions.toggleCancelList());
   }

   return (
      <div ref={drop} role={"canceller"} onClick={toggleCancelList} className="cancel_order drag">
         <p className="drag_title --no-reverse">Отменить</p>
         &nbsp;
      </div>
   );
};

export default CancelOrderDrag;
