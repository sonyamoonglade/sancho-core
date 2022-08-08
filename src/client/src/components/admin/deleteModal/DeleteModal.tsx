import React from "react";
import "../productModal/product-modal.styles.scss";
import { adminSelector, useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../../redux";
import "./del-modal.styles.scss";
import { Events } from "../../../events/Events";
import { useEvents } from "../../../hooks/useEvents";
import { useAdminApi } from "../../../hooks/useAdminApi";

const DeleteModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const events = useEvents();
   const { selectedProduct } = useAppSelector(adminSelector);
   const dispatch = useAppDispatch();

   const { deleteProduct } = useAdminApi();

   function toggleDeleteModal() {
      dispatch(windowActions.toggleDelete(false));
   }

   async function handleDelete() {
      if (!selectedProduct) {
         return;
      }
      const ok = await deleteProduct(selectedProduct?.id);
      if (!ok) {
         //todo: indicate error
         return;
      }

      events.emit(Events.REFRESH_ADMIN_CATALOG);
   }

   return (
      <div className={admin.delete && selectedProduct ? "delete product_modal --product-modal-active" : "delete product_modal"}>
         <p className="product_modal_name">Подвердить удаление "{selectedProduct?.translate}"?</p>

         <div className="delete_content">
            <button onClick={handleDelete} className="delete_control --red">
               Да
            </button>
            <button onClick={toggleDeleteModal} className="delete_control --green-darker">
               Нет
            </button>
         </div>
      </div>
   );
};

export default DeleteModal;
