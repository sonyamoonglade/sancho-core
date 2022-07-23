import React from "react";
import "../drag.styles.scss";
import { useDrop } from "react-dnd";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";
import { useAppDispatch, windowActions } from "../../../../redux";

const CompleteOrderDrag = () => {
   const dispatch = useAppDispatch();
   const [{}, drop] = useDrop(() => ({
      accept: "ORDER",

      drop: () => ({
         zone: DropZones.COMPLETE
      })
   }));

   function toggleCompleteList() {
      dispatch(windowActions.toggleCompleteList());
   }

   return (
      <div ref={drop} role={"finisher"} onClick={toggleCompleteList} className="complete_order drag">
         <p className="drag_title">Готов</p>
         &nbsp;
      </div>
   );
};

export default React.memo(CompleteOrderDrag);
