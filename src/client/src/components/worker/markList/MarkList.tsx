import React, { useMemo } from "react";
import "./MarkItem";
import { useAppDispatch, useAppSelector, windowSelector, workerActions, workerSelector } from "../../../redux";
import Mark from "./MarkItem";
import { useMark } from "../modal/mark/hooks/useMark";

const MarkList = () => {
   const { user } = useAppSelector(workerSelector);

   const { worker } = useAppSelector(windowSelector);
   const isActive = useMemo(() => {
      return user.marks.length > 0;
   }, [worker, user]);

   const { deleteMark } = useMark();
   const dispatch = useAppDispatch();
   async function handleMarkDelete(markId: number) {
      const res = await deleteMark(markId);
      if (!res) {
         return;
      }
      dispatch(workerActions.setMarks(user.marks.filter((m) => m.id !== markId)));
      return;
   }

   return (
      <div className={isActive ? "marks list --marks-active" : "marks list"}>
         {user?.marks?.map((mark) => (
            <Mark onDelete={handleMarkDelete} mark={mark} key={mark.id} />
         ))}
      </div>
   );
};

export default React.memo(MarkList);
