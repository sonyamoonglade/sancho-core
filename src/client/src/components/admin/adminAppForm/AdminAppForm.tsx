import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../../redux";

const AdminAppForm = () => {
   const dispatch = useAppDispatch();
   const { admin } = useAppSelector(windowSelector);
   const { productModal } = admin;
   const isActive = useMemo(() => {
      return productModal;
   }, [productModal]);

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
