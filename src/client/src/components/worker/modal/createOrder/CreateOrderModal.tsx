import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions, workerSelector } from "../../../../redux";
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

   const dispatch = useAppDispatch();

   function toggleVirtualCart() {
      dispatch(windowActions.toggleVirtualCart());
   }

   const { formValues, setFormDefaults, setFormValues, getFormValues, isSubmitButtonActive } = useCreateOrderForm();
   const { createMasterOrder } = useCreateMasterOrder();

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

   useEffect(() => {
      const totalVcPrice = utils.getOrderTotalPrice(virtualCartState.items);
      setTotalOrderPrice(totalVcPrice);
   }, [virtualCartState.items]);

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
