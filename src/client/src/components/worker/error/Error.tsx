import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector, workerActions, workerSelector } from "../../../redux";

import "./error.styles.scss";

const Error = () => {
   const { error } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();

   function closeErrorWindow() {
      dispatch(workerActions.toggleErrorModal());
      setTimeout(() => {
         dispatch(workerActions.setError(""));
      }, 500);
   }

   useEffect(() => {
      let t: any;
      const second = 1000;
      if (error.modal) {
         t = setTimeout(() => {
            dispatch(workerActions.toggleErrorModal(false));
            setTimeout(() => {
               dispatch(workerActions.setError(""));
            }, second);
         }, second * 5);
      }
      return () => clearTimeout(t);
   }, [dispatch, error.modal]);

   return (
      <div onClick={() => closeErrorWindow()} className={error.modal ? "err --err-active" : "err"}>
         {error.val}
      </div>
   );
};

export default Error;
