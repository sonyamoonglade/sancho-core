import React from "react";
import "../drag.styles.scss";
import { useDrop } from "react-dnd";
import { DropZones } from "../../../orderHistory/OrderHistoryItem";
import { useAppDispatch, windowActions } from "../../../../redux";

const MarkDrag = () => {
   const dispatch = useAppDispatch();
   const [{}, drop] = useDrop(() => ({
      accept: "ORDER",

      drop: () => ({
         zone: DropZones.MARK
      })
   }));

   function toggleCompleteList() {
      dispatch(windowActions.toggleMark());
   }

   return (
      <div ref={drop} role={"mark"} onClick={toggleCompleteList} className="mark drag">
         <p className="drag_title">Готов</p>
         &nbsp;
      </div>
   );
};

export default React.memo(MarkDrag);
