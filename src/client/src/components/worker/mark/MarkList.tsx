import React, { useEffect, useMemo } from "react";
import "./MarkItem";
import { useAppSelector, windowSelector, workerSelector } from "../../../redux";
import Mark from "./MarkItem";
const MarkList = () => {
   const { user } = useAppSelector(workerSelector);

   const { worker } = useAppSelector(windowSelector);
   const isActive = useMemo(() => {
      return user.marks.length > 0;
   }, [worker, user]);
   return (
      <div className={isActive ? "marks --marks-active" : "marks"}>
         {user?.marks?.map((mark) => (
            <Mark mark={mark} key={mark.id} />
         ))}
      </div>
   );
};

export default React.memo(MarkList);
