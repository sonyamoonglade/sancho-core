import React, { useEffect, useState } from "react";
import { miscSelector, useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions, workerSelector } from "../../../../redux";
import "./create-order.styles.scss";
import CreateOrderForm from "./createForm/CreateOrderForm";
import { RiSettings4Line } from "react-icons/ri";
import VirtualCart from "../../virtualCart/VirtualCart";
import { currency } from "../../../../common/constants";
import { utils } from "../../../../utils/util.functions";
import { useCreateOrderForm } from "./hooks/useCreateOrderForm";
import { useCreateMasterOrder } from "./hooks/useCreateMasterOrder";
import { useVirtualCart } from "../../hooks/useVirtualCart";

const CreateOrderModal = () => {
   const { worker } = useAppSelector(windowSelector);
   const { virtualCart: virtualCartState } = useAppSelector(workerSelector);
   const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);
   const { DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE } = useAppSelector(miscSelector);

   const dispatch = useAppDispatch();

   function toggleVirtualCart() {
      dispatch(windowActions.toggleVirtualCart());
   }

   const { formValues, setFormDefaults, setFormValues, getFormValues, setUserCredentials, isSubmitButtonActive } = useCreateOrderForm();
   const { createMasterOrder, fetchUserCredentials } = useCreateMasterOrder();

   const virtualCart = useVirtualCart();

   async function handleOrderCreation() {
      if (!isSubmitButtonActive) {
         return;
      }
      if (totalOrderPrice === 0) {
         return;
      }
      if (virtualCartState.items.length === 0) {
         return;
      }

      // todo: apply typing!
      const body: any = getFormValues();
      if (virtualCartState.items.length === 0) {
         return;
      }
      body.cart = virtualCartState.items;

      await createMasterOrder(body);
      dispatch(windowActions.toggleCreateOrder());
      dispatch(workerActions.setVirtualCart([]));
      virtualCart.clearVirtualCart();
   }
   async function fetchAndSetUserCredentialsAsync(phoneNumber: string) {
      const creds = await fetchUserCredentials(phoneNumber);
      if (creds !== null) {
         setUserCredentials(creds);
         dispatch(workerActions.setMarks(creds.marks));
         return;
      }
      return;
   }
   function checkIsPunished(v: number): boolean {
      return v < DELIVERY_PUNISHMENT_THRESHOLD;
   }

   function applyPunishment(v: number): number {
      return v + DELIVERY_PUNISHMENT_VALUE;
   }

   useEffect(() => {
      let price = utils.getOrderTotalPrice(virtualCartState.items);
      if (formValues.is_delivered_c.value) {
         const isPunished = checkIsPunished(price);
         if (isPunished) {
            price = applyPunishment(price);
         }
      }
      setTotalOrderPrice(price);
   }, [virtualCartState.items, formValues.is_delivered_c.value]);
   useEffect(() => {
      const { isValid, value: phoneNumber } = formValues.phone_number_c;
      if (worker.createOrder && isValid) {
         fetchAndSetUserCredentialsAsync(phoneNumber);
      } else {
         dispatch(workerActions.setMarks([]));
      }
   }, [formValues.phone_number_c.isValid]);

   useEffect(() => {
      if (!worker.createOrder) {
         dispatch(workerActions.setVirtualCart([]));
         virtualCart.clearVirtualCart();
      }
   }, [worker.createOrder]);

   return (
      <div className={worker.createOrder ? "worker_modal create --w-opened" : "worker_modal create"}>
         <p className="modal_title">Создать заказ</p>
         <RiSettings4Line onClick={toggleVirtualCart} className="submit_settings" size={25} />
         <VirtualCart />
         <CreateOrderForm setFormDefaults={setFormDefaults} setFormValues={setFormValues} formValues={formValues} />

         <div className="verify_sum">
            <p>Сумма заказа </p>
            <p>
               {totalOrderPrice}.00 {currency}
            </p>
         </div>
         <button onClick={handleOrderCreation} className="modal_button">
            Создать заказ
         </button>
      </div>
   );
};

export default CreateOrderModal;
