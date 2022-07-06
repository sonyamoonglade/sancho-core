import React, { FC } from "react";

import "./marks.styles.scss";
import { Mark } from "../../../types/types";
import { GrFormClose } from "react-icons/gr";
interface markProps {
   mark: Mark;
}

const MarkItem: FC<markProps> = ({ mark }) => {
   return (
      <div className={mark.is_important ? "mark_item --green" : "mark_item"}>
         <p>{mark.content}</p>
         <GrFormClose className="mark_close_icon" size={35} />
      </div>
   );
};

export default MarkItem;
