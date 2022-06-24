import React, { useEffect, useState } from "react";
import { miscSelector, useAppDispatch, useAppSelector, windowActions, windowSelector, workerActions, workerSelector } from "../../../../redux";
import "./verify-order.styles.scss";
import "../../../createUserOrder/orderForm/order-form.styles.scss";
import { RiSettings4Line } from "react-icons/ri";
import { useAxios } from "../../../../hooks/useAxios";
import { useVerifyOrderForm, WorkerVerifyOrderFormState } from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";
import VirtualCart from "../../virtualCart/VirtualCart";
import { useVirtualCart } from "../../hooks/useVirtualCart";
import { currency } from "../../../../common/constants";
import { useVerifyOrder } from "./hooks/useVerifyOrder";
import { utils } from "../../../../utils/util.functions";
import { useFormValidations } from "../../../../hooks/useFormValidations";

const VerifyOrderModal = () => {
   const { worker, drag } = useAppSelector(windowSelector);
   const { orderQueue, virtualCart: virtualCartState } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();
   const { client } = useAxios();
   const virtualCart = useVirtualCart();

   const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);

   const {
      formValues,
      getFormValues,
      presetDeliveryDetails,
      setFormValues,
      setFormDefaults,
      isSubmitButtonActive,
      setFormDefaultsExceptPhoneNumberAndFullname
   } = useVerifyOrderForm(orderQueue);

   const { verifyOrder, findWaitingOrderByPhoneNumber } = useVerifyOrder(client, orderQueue, totalOrderPrice, virtualCartState.items);

   const { minLengthValidation } = useFormValidations();

   const { DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE } = useAppSelector(miscSelector);

   async function handleOrderVerification() {
      if (!isSubmitButtonActive) {
         return;
      }
      const phoneNumber = formValues.phone_number_w.value;
      const body: any = getFormValues();
      await verifyOrder(body, phoneNumber);
      dispatch(windowActions.toggleVerifyOrder());
   }

   function toggleVirtualCart() {
      dispatch(windowActions.toggleVirtualCart());
      presetVirtualCartItems(formValues.phone_number_w.value);
   }
   function presetVirtualCartItems(phoneNumber: string) {
      if (formValues.phone_number_w.isValid) {
         const order = findWaitingOrderByPhoneNumber(phoneNumber);
         const parsedCart =
            order?.cart.map((item: any) => {
               return JSON.parse(item as unknown as string);
            }) || [];
         dispatch(workerActions.setVirtualCart(parsedCart));
         virtualCart.setVirtualCart(parsedCart);
      }
   }

   useEffect(() => {
      if (!worker.verifyOrder) {
         dispatch(workerActions.setVirtualCart([]));
         virtualCart.clearVirtualCart();
         return;
      }
      const currentCart = virtualCart.getCurrentCart();
      if (currentCart.length === 0) {
         // null value in local storage
         virtualCart.setVirtualCart([]);
      }

      if (worker.verifyOrder && drag.item && drag.item.id !== 0) {
         const phoneNumber = drag.item.phoneNumber.substring(2, drag.item.phoneNumber.length);
         setFormValues((state: WorkerVerifyOrderFormState) => {
            const obj = state.phone_number_w;
            obj.value = phoneNumber;
            obj.isValid = minLengthValidation(phoneNumber, 10);
            return { ...state, phone_number_w: obj };
         });
         presetDeliveryDetails();
      }
   }, [worker.verifyOrder]);
   useEffect(() => {
      if (formValues.phone_number_w.isValid === false) {
         setTotalOrderPrice(0);
         return;
      }
      if (formValues.phone_number_w.isValid && worker.virtualCart) {
         let price = utils.getOrderTotalPrice(virtualCartState.items);
         const isPunished = checkIsPunished(price);
         if (isPunished) {
            price = applyPunishment(price);
         }
         setTotalOrderPrice(price);
      } else {
         const o = findWaitingOrderByPhoneNumber(formValues.phone_number_w.value);
         let price = utils.getOrderTotalPriceByCart(o?.cart);
         const isPunished = checkIsPunished(price);
         if (isPunished) {
            price = applyPunishment(price);
         }
         setTotalOrderPrice(price);
      }
   }, [formValues.phone_number_w.isValid, virtualCartState.items]);

   function checkIsPunished(v: number): boolean {
      return v < DELIVERY_PUNISHMENT_THRESHOLD;
   }

   function applyPunishment(v: number): number {
      return v + DELIVERY_PUNISHMENT_VALUE;
   }

   return (
      <div className={worker.verifyOrder ? "worker_modal --w-opened" : "worker_modal"}>
         <p className="modal_title">Подтвердить заказ</p>
         <RiSettings4Line onClick={toggleVirtualCart} className="submit_settings" size={25} />
         <VirtualCart />
         <VerifyOrderForm
            setFormDefaultsExceptPhoneNumberAndFullname={setFormDefaultsExceptPhoneNumberAndFullname}
            presetDeliveryDetails={presetDeliveryDetails}
            formValues={formValues}
            setFormDefaults={setFormDefaults}
            setFormValues={setFormValues}
         />

         <div className="verify_sum">
            <p>Сумма заказа</p>
            <p>
               {totalOrderPrice}.00 {currency}
            </p>
         </div>
         <button onClick={handleOrderVerification} className="modal_button">
            Подтвердить
         </button>
      </div>
   );
};

export default React.memo(VerifyOrderModal);
