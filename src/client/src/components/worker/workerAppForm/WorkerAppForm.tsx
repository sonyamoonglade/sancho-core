import { defaultItem } from "../../orderHistory/OrderHistoryItem";

import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions } from "../../../redux";
import { useVirtualCart } from "../hooks/useVirtualCart";

const WorkerAppForm = () => {
   const { worker } = useAppSelector(windowSelector);
   const dispatch = useAppDispatch();
   const { setVirtualCart } = useVirtualCart();
   function disableAllWorker() {
      if (isActive) {
         dispatch(windowActions.toggleWorkersOff());
         dispatch(workerActions.setVirtualCart([]));
         dispatch(windowActions.setDropItem(defaultItem));
         setVirtualCart([]);
      }
   }

   const isActive = useMemo(() => {
      const keys: string[] = Object.keys(worker).filter((key) => key !== "cancelList" && key !== "completeList");
      for (const key of keys) {
         // @ts-ignore
         if ((worker[key as unknown as string] as unknown as boolean) === true) {
            document.body.style.overflow = "hidden";
            return true;
         }
      }
      document.body.style.overflow = "visible hidden";
      return false;
   }, [worker]);

   return (
      <div onClick={disableAllWorker} className={isActive ? "app_form w visible" : "app_form w"}>
         &nbsp;
      </div>
   );
};

export default WorkerAppForm;
