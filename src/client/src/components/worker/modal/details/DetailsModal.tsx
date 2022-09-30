import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions, workerSelector } from "../../../../redux";
import { useCorrectOrderData } from "../../../orderHistory/hooks/useCorrectOrderData";
import "./details.styles.scss";
import { useWorkerApi } from "../../../../hooks/useWorkerApi";
import { useVirtualCart } from "../../hooks/useVirtualCart";
import { RiSettings4Line } from "react-icons/ri";
import VirtualCart from "../../virtualCart/VirtualCart";

const DetailsModal = () => {
   const { worker } = useAppSelector(windowSelector);
   const { detailedOrder } = useAppSelector(workerSelector);
   const { downloadCheck } = useWorkerApi();
   const dispatch = useAppDispatch();
   const virtualCart = useVirtualCart();
   const { fetchUserCredentials } = useWorkerApi();

   function deliveryTranslate(isDelivered: boolean) {
      return isDelivered ? "Да" : "Нет";
   }

   function deliveredAsapTranslate(v: boolean): string {
      return v ? "как можно скорее" : "";
   }

   const { cddate, cid, cdate, correctData } = useCorrectOrderData(detailedOrder);

   async function fetchCredentialsWrapper() {
      //in this case phoneNumber goes with '+' so need to cut it up to 2 chars so it becomes 79128988808..
      const len = detailedOrder?.user?.phone_number.length;
      const formattedPhoneNumber = detailedOrder?.user?.phone_number.substring(2, len);
      const creds = await fetchUserCredentials(formattedPhoneNumber);
      dispatch(workerActions.setMarks(creds?.marks));
   }

   useEffect(() => {
      if (worker.details && detailedOrder) {
         correctData();
         fetchCredentialsWrapper();
      } else {
         dispatch(workerActions.setDetailedOrder(null));
         dispatch(workerActions.setMarks([]));
      }
   }, [worker, detailedOrder]);
   useEffect(() => {
      if (worker.virtualCart) {
         presetVirtualCart();
      }
   }, [worker.virtualCart]);

   async function handleCheckDownload() {
      await downloadCheck(detailedOrder.id);
   }

   function toggleVirtualCart() {
      dispatch(windowActions.toggleVirtualCart());
   }

   function presetVirtualCart() {
      const cart = detailedOrder?.cart || [];
      virtualCart.setVirtualCart(cart);
      dispatch(workerActions.setVirtualCart(cart));
      return;
   }

   return (
      <div className={worker.details && detailedOrder ? "details worker_modal --w-opened" : "details worker_modal"}>
         <p className="modal_title">Детали заказа</p>
         <RiSettings4Line onClick={toggleVirtualCart} className="submit_settings" size={25} />
         <VirtualCart />

         <div className="detail_data">
            <p className="detail_item">Номер заказа: #{cid}</p>
            <p className="detail_item">Заказчик: {detailedOrder?.user?.name || " - "}</p>
            <p className="detail_item">Номер телефона: {detailedOrder?.user?.phone_number || " - "}</p>
            <br />
            <p className="detail_item">Оформлен: {cdate}</p>
            <br />
            <p className="detail_item">Доставка: {deliveryTranslate(detailedOrder.is_delivered)}</p>
            {detailedOrder.is_delivered && (
               <>
                  <p className="detail_item">Адрес: ул. {detailedOrder.delivery_details.address}</p>
                  <p className="detail_item">
                     Подъезд {detailedOrder.delivery_details.entrance_number} | Этаж {detailedOrder.delivery_details.floor} |
                     Квартира&nbsp;
                     {detailedOrder.delivery_details.flat_call}
                  </p>
                  <br />
                  <p className="detail_item">
                     Доставка:&nbsp;
                     {detailedOrder.is_delivered_asap ? deliveredAsapTranslate(detailedOrder.is_delivered_asap) : cddate}
                  </p>
                  <p className="detail_item">Комментарий курьеру: {detailedOrder?.delivery_details?.comment || "отсутствует"}</p>
               </>
            )}
            <br />
         </div>
         <div className="detail_sum">
            <p className="detail_item">Сумма заказа: </p>
            <strong className="detail_item">{detailedOrder.amount}.00 ₽</strong>
         </div>
         <button className="modal_button" onClick={handleCheckDownload}>
            Скачать как чек
         </button>
      </div>
   );
};

export default React.memo(DetailsModal);
