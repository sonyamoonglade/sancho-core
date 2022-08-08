import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../../redux";

const AdminAppForm = () => {
   const dispatch = useAppDispatch();
   const { admin } = useAppSelector(windowSelector);
   const { create, edit, delete: del } = admin;
   const isActive = useMemo(() => {
      return create || edit || del;
   }, [create, edit, del]);

   function handleCloseAll() {
      dispatch(windowActions.closeAllAdmin());
   }

   return (
      <div onClick={handleCloseAll} className={isActive ? "app_form visible" : "app_form"}>
         &nbsp;
      </div>
   );
};

export default AdminAppForm;
