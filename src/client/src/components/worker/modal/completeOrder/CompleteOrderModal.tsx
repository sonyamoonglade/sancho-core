import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../../../redux";
import { CompleteOrderFormValues, useCompleteOrderForm } from "./hooks/useCompleteOrderForm";
import CompleteOrderForm from "./completeForm/CancelOrderForm";
import "./complete-order.styles.scss";
import { useCompleteOrder } from "./hooks/useCompleteOrder";

const CompleteOrderModal = () => {
   const { worker, drag } = useAppSelector(windowSelector);
   const { formValues, setCorrectOrderId, setFormDefaults, setFormValues, getFormValues, setCompletable, completable } = useCompleteOrderForm();
   const { completeOrder } = useCompleteOrder();
   const dispatch = useAppDispatch();
   useEffect(() => {
      if (worker.completeOrder && drag.item && drag.item.id !== 0) {
         setCorrectOrderId(drag.item.id);
         setCompletable(true);
      }
   }, [worker.completeOrder]);

   async function handleOrderCompletion() {
      if (!completable) {
         return;
      }

      try {
         const body: CompleteOrderFormValues = getFormValues();
         await completeOrder(body);
         dispatch(windowActions.toggleCompleteOrder(false));
      } catch (e) {}
   }
   return (
      <div className={worker.completeOrder ? "worker_modal complete --w-opened" : "worker_modal"}>
         <div>
            <p className="modal_title">Подтвердить готовность заказа</p>

            <CompleteOrderForm setFormDefaults={setFormDefaults} setFormValues={setFormValues} formValues={formValues} />
            <div className="complete info">
               <p>
                  Подтверждая заказ, вы утверждаете, что содержимое заказа полностью готово и пригодно к употреблению, и подготовлено к самовывозу или
                  доставке курьером
               </p>
               <hr className="separator" />

               <p>Данное действие уведомит курьера о доставке и передаст ему информацию об адресе заказчика.</p>
               <hr className="separator" />
               <p>Заказчик получит уведомление о готовности заказа</p>
            </div>
         </div>
         <div>
            <div className="cancel_status complete_status">
               <p>Заказ</p>
               <p>{completable ? "Может быть подтвержден" : "Не может быть подтвержден"}</p>
            </div>
            <button onClick={handleOrderCompletion} className="modal_button complete">
               Подтвердить готовность
            </button>
         </div>
      </div>
   );
};

export default CompleteOrderModal;
