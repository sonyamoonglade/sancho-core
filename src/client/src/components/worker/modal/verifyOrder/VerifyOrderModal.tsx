import React, { useEffect, useState } from "react";
import {
  miscSelector,
  useAppDispatch,
  useAppSelector,
  windowActions,
  windowSelector,
  workerActions,
  workerSelector,
} from "../../../../redux";
import "./verify-order.styles.scss";
import "../../../createUserOrder/orderForm/order-form.styles.scss";
import { RiSettings4Line } from "react-icons/ri";
import { useAxios } from "../../../../hooks/useAxios";
import { useVerifyOrderForm } from "./hooks/useVerifyOrderForm";
import VerifyOrderForm from "./verifyForm/VerifyOrderForm";
import VirtualCart from "../../virtualCart/VirtualCart";
import { useVirtualCart } from "../../hooks/useVirtualCart";
import { currency } from "../../../../common/constants";
import { useVerifyOrder } from "./hooks/useVerifyOrder";
import { utils } from "../../../../utils/util.functions";
import { useCreateMasterOrder, UserCredentials } from "../createOrder/hooks/useCreateMasterOrder";

const VerifyOrderModal = () => {
   const { worker, drag } = useAppSelector(windowSelector);
   const { orderQueue, virtualCart: virtualCartState } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();
   const client = useAxios();
   const virtualCart = useVirtualCart();
   const [isFetchedCreds, setIsFetchedCreds] = useState<boolean>(false);
   const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);

   const {
      formValues,
      getFormValues,
      presetDeliveryDetails,
      setFormValues,
      setFormDefaults,
      isSubmitButtonActive,
      setCredentialsHard,
      setPhoneNumber,
      setCredentials
   } = useVerifyOrderForm(orderQueue);

   const { verifyOrder, findWaitingOrderByPhoneNumber } = useVerifyOrder(client, orderQueue, totalOrderPrice, virtualCartState.items);
   const { fetchUserCredentials } = useCreateMasterOrder();
   const { DELIVERY_PUNISHMENT_THRESHOLD, DELIVERY_PUNISHMENT_VALUE } = useAppSelector(miscSelector);

   function toggleVirtualCart() {
      dispatch(windowActions.toggleVirtualCart());
      presetVirtualCartItems(formValues.phone_number_w.value);
   }
   function presetVirtualCartItems(phoneNumber: string) {
      if (formValues.phone_number_w.isValid) {
         const order = findWaitingOrderByPhoneNumber(phoneNumber);
         const parsedCart = order?.cart || [];
         dispatch(workerActions.setVirtualCart(parsedCart));
         virtualCart.setVirtualCart(parsedCart);
      }
   }
   function checkIsPunished(v: number): boolean {
      return v <= DELIVERY_PUNISHMENT_THRESHOLD;
   }
   function applyPunishment(v: number): number {
      return v + DELIVERY_PUNISHMENT_VALUE;
   }
   async function fetchUserCredentialsAsync(phoneNumber: string, hard: boolean = false): Promise<void> {
      const creds: UserCredentials = await fetchUserCredentials(phoneNumber);
      if (creds !== null) {
         if (hard) {
            setCredentialsHard(creds);
         } else {
            setCredentials(creds);
         }
         dispatch(workerActions.setMarks(creds.marks));
         setIsFetchedCreds(true);
      }
      return;
   }
   async function handleOrderVerification() {
      if (!isSubmitButtonActive) {
         return;
      }
      const phoneNumber = formValues.phone_number_w.value;
      const body: any = getFormValues();
      const order = findWaitingOrderByPhoneNumber(phoneNumber);
      // Make sure price has changed, cart is not empty ( first condition fails if worker toggles delivery ). Virtual cart stays empty so check it.
      if (order.total_cart_price !== totalOrderPrice && totalOrderPrice !== 0 && virtualCartState.items.length) {
         body.cart = virtualCartState.items;
      }
      await verifyOrder(body);
      dispatch(windowActions.toggleVerifyOrder());
   }
   async function fetchCredentialsManually(phoneNumber: string): Promise<void> {
      await fetchUserCredentialsAsync(phoneNumber, true);
      setIsFetchedCreds(true);
      return;
   }

   useEffect(() => {
      if (!worker.verifyOrder) {
         dispatch(workerActions.setVirtualCart([]));
         virtualCart.clearVirtualCart();
         setFormDefaults();
         setIsFetchedCreds(false);
         dispatch(workerActions.setMarks([]));
         return;
      }
      const currentCart = virtualCart.getCurrentCart();
      if (currentCart.length === 0) {
         // null value in local storage
         virtualCart.setVirtualCart([]);
      }

      if (worker.verifyOrder && drag.item && drag.item.id !== 0) {
         const phoneNumber = drag.item.phoneNumber.substring(2, drag.item.phoneNumber.length);
         const order = findWaitingOrderByPhoneNumber(phoneNumber);
         setPhoneNumber(phoneNumber);
         if (order.is_delivered) {
            presetDeliveryDetails(order);
         }
      }
   }, [worker.verifyOrder]);
   useEffect(() => {
      if (!worker.verifyOrder) {
         return;
      }
      const { isValid, value: phoneNumber } = formValues.phone_number_w;
      const o = findWaitingOrderByPhoneNumber(phoneNumber);

      if (isValid === false) {
         setTotalOrderPrice(0);
         setIsFetchedCreds(false);
         dispatch(workerActions.setMarks([]));
         return;
      }

      if (!isFetchedCreds) {
         fetchUserCredentialsAsync(phoneNumber);
      }

      if (worker.virtualCart) {
         let price = utils.getOrderTotalPrice(virtualCartState.items);
         if (formValues.is_delivered_w.value) {
            if (checkIsPunished(price)) {
               price = applyPunishment(price);
            }
         }
         setTotalOrderPrice(price);
         return;
      }

      let price = utils.getOrderTotalPriceByCart(o?.cart);
      if (formValues.is_delivered_w.value) {
         //check and apply punishment
         if (checkIsPunished(price)) {
            price = applyPunishment(price);
         }
      }
      setTotalOrderPrice(price);
   }, [formValues.phone_number_w.isValid, virtualCartState.items, formValues.is_delivered_w.value]);

   return (
      <div className={worker.verifyOrder ? "worker_modal --w-opened" : "worker_modal"}>
         <p className="modal_title">Подтвердить заказ</p>
         <RiSettings4Line onClick={toggleVirtualCart} className="submit_settings" size={25} />
         <VirtualCart />
         <VerifyOrderForm fetchCredentialsManually={fetchCredentialsManually} formValues={formValues} setFormValues={setFormValues} />

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
