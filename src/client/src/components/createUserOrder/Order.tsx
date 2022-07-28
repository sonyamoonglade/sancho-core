import React, { useEffect } from "react";

import "./order.styles.scss";
import { TiArrowBack } from "react-icons/ti";
import { GrFormClose } from "react-icons/gr";
import { useCart } from "../../hooks/useCart";
import { orderActions, useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../redux";
import OrderForm from "./orderForm/OrderForm";
import Check from "./check/Check";
import { useUserOrderForm } from "./hooks/useUserOrderForm";
import { CLEAR_ORDER_FORM, CLEAR_ORDER_FORM_ONLY_PHONE, FormField, UserOrderFormData } from "../../types/types";
import { DeliveryDetails } from "../../common/types";
import { baseUrl } from "../../App";
import { useEvents } from "../../hooks/useEvents";

export interface UserOrderFormValuesInterface {
   is_delivered: boolean;
   phone_number: string;
   is_delivered_asap: boolean;
   delivery_details?: DeliveryDetails;
}

export interface UserOrderFormState {
   phone_number: FormField;
   is_delivered: {
      value: boolean;
      isValid: boolean;
   };
   is_delivered_asap: {
      value: boolean;
      isValid: boolean;
   };
   entrance_number: FormField;
   floor: FormField;
   flat_call: FormField;
   address: FormField;
   comment: FormField;
}

const Order = () => {
   const cart = useCart();

   const { userOrder, pay } = useAppSelector(windowSelector);
   const dispatch = useAppDispatch();
   const { formValues, isSubmitButtonActive, setFormValues, setFormDefaults, getFormValues, clearPhone } = useUserOrderForm();
   const events = useEvents();

   useEffect(() => {
      dispatch(orderActions.setCanPay(isSubmitButtonActive));
      const data = getOrderData();
      if (!data) {
         return;
      }
      dispatch(orderActions.setUserOrder(data));
   }, [isSubmitButtonActive, formValues]);

   useEffect(() => {
      //Register events only once
      if (events.listeners(CLEAR_ORDER_FORM).length === 0) {
         events.on(CLEAR_ORDER_FORM, setFormDefaults);
      }
      if (events.listeners(CLEAR_ORDER_FORM_ONLY_PHONE).length === 0) {
         events.on(CLEAR_ORDER_FORM_ONLY_PHONE, clearPhone);
      }
   }, []);

   useEffect(() => {
      if (userOrder) {
         document.querySelector(".phone_number_input").classList.remove("--valid");

         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "visible";
      }
   }, [userOrder]);

   function getOrderData(): UserOrderFormData {
      const formValues = getFormValues();
      const usrCart = cart.getCart();
      const price = cart.calculateCartTotalPrice();
      if (price === 0) {
         return null;
      }
      const orderData: UserOrderFormData = {
         ...formValues,
         cart: usrCart
      };
      return orderData;
   }

   function toggleOrder() {
      dispatch(windowActions.toggleUserOrder());
   }
   function closeAllModals() {
      dispatch(windowActions.closeAll());
   }

   return (
      <div className={userOrder ? "make_user_order modal modal--visible" : "make_user_order modal"}>
         <div className="user_order_header">
            <TiArrowBack onClick={() => toggleOrder()} className="user_order_back_icon" size={30} />
            <p className="user_order_title">Оформление заказа</p>
            <GrFormClose onClick={() => closeAllModals()} className="user_order_close_icon" size={35} />
         </div>
         <div className="make_user_order_form">
            <img className="badge_image" src={`${baseUrl}/non_verified_badge.png`} alt="" />
            <p className="check_title">Чек</p>

            <div className="form_top">
               <Check isDelivered={formValues.is_delivered.value} cart={cart} />
            </div>

            <OrderForm formValues={formValues} setFormValues={setFormValues} />
         </div>
      </div>
   );
};

export default React.memo(Order);
