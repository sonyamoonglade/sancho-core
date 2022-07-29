import React, { FC } from "react";

import "./marks.styles.scss";
import { Mark } from "../../../types/types";
import { GrFormClose } from "react-icons/gr";

interface markProps {
   onDelete: (markId: number) => Promise<void>;
   mark: Mark;
   readonly: boolean;
}

const MarkItem: FC<markProps> = ({ mark, onDelete, readonly }) => {
   return (
      <div className={mark.is_important ? "mark_item --green" : "mark_item"}>
         <p>{mark.content}</p>
         {!readonly && <GrFormClose onClick={() => onDelete(mark.id)} className="mark_close_icon" size={35} />}
      </div>
   );
};

export default MarkItem;
