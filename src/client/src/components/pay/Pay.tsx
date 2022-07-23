import React, { useEffect, useMemo, useState } from "react";
import { orderSelector, productActions, useAppDispatch, useAppSelector, userSelector, windowActions, windowSelector } from "../../redux";
import "./pay.styles.scss";
import { TiArrowBack } from "react-icons/ti";
import { baseUrl } from "../../App";
import PaySelector from "../ui/paySelector/PaySelector";
import * as types from "../../common/types";
import FormInput from "../formInput/FormInput";
import { CLEAR_ORDER_FORM, CLEAR_ORDER_FORM_ONLY_PHONE, FormField } from "../../types/types";
import { useFormValidations } from "../../hooks/useFormValidations";
import SubmitOrderButton from "../createUserOrder/submitOrderButton/SubmitOrderButton";
import { usePayForm } from "./hooks/usePayForm";
import { useUserOrderForm } from "../createUserOrder/hooks/useUserOrderForm";
import { useAxios } from "../../hooks/useAxios";
import { useCreateOrder } from "../createUserOrder/hooks/useCreateOrder";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useCart } from "../../hooks/useCart";
import { useEvent } from "../../hooks/useEvent";
import { CreateUserOrderDto } from "../../common/types";

const Pay = () => {
   const { pay } = useAppSelector(windowSelector);

   const dispatch = useAppDispatch();

   function togglePay() {
      dispatch(windowActions.togglePay(false));
   }

   const { minLengthValidation } = useFormValidations();

   const { setFormValues, setPayWay, handlePaywaySwitch, formValues, payWay, getFormValues, setFormDefaults } = usePayForm();
   const { userOrder: orderData } = useAppSelector(orderSelector);
   const events = useEvent();
   const is_delivered = orderData?.is_delivered || false;
   const cart = useCart();

   const client = useAxios();
   const { createUserOrder } = useCreateOrder(client);
   const { login } = useAuthentication(client);
   const { isAuthenticated, phoneNumber: userPhoneNumber } = useAppSelector(userSelector);

   useEffect(() => {
      if (pay) {
         setFormDefaults();
      }
   }, [pay]);

   const isSubmitButtonActive = useMemo(() => {
      return formValues.email.isValid && formValues.username.isValid;
   }, [formValues]);

   async function handleOrderCreation() {
      const { phone_number: phoneNumber } = orderData;
      try {
         if (!isAuthenticated) {
            await login(phoneNumber);
         } else if (phoneNumber !== userPhoneNumber) {
            await login(phoneNumber);
         }
      } catch (e: any) {
         console.log(e);
         events.emit(CLEAR_ORDER_FORM_ONLY_PHONE);
         const message = e?.response?.data?.message;
         dispatch(windowActions.startErrorScreenAndShowMessage(message || "Ошибочка..."));
      }

      try {
         const data = getFormValues();
         const { cart: usrCart, is_delivered_asap, delivery_details, is_delivered } = orderData;
         const createOrderDto: CreateUserOrderDto = {
            cart: usrCart,
            delivery_details,
            is_delivered,
            is_delivered_asap,
            pay: payWay
         };
         //Only if user selects withCard we need it's personal data (email, username)
         if (payWay === "withCard") {
            createOrderDto.email = data.email;
            createOrderDto.username = data.username;
         }
         //validate promo here
         if (data.promo) {
            createOrderDto.promo = data.promo;
         }

         console.log(createOrderDto);

         await createUserOrder(createOrderDto);
         cart.clearCart();
         events.emit(CLEAR_ORDER_FORM);
         dispatch(productActions.setCartEmpty(true));
         dispatch(productActions.setTotalCartPrice(0));
      } catch (e: any) {
         const message = e?.response?.data?.message;
         events.emit(CLEAR_ORDER_FORM_ONLY_PHONE);
         dispatch(windowActions.startErrorScreenAndShowMessage(message || "Ошибочка..."));
      }
   }

   return (
      <div className={pay ? "pay modal modal--visible" : "pay modal"}>
         <div className="pay_header">
            <TiArrowBack onClick={() => togglePay()} className="cart_back_icon" size={30} />
            <p>Оплата</p>
         </div>
         <div className="pay_container">
            <p className="pay_title">Способ оплаты</p>
            <ul className="pay_way">
               <li className="payway_item">
                  <PaySelector opt={"withCard"} onClick={handlePaywaySwitch} selected={payWay === "withCard"} disabled={false} />
                  <div className="payway_content">
                     <p className="main_content">Банковской картой</p>
                     <img className="card_payment_icon" src={`${baseUrl}/card-payment.png`} alt="payment" />
                  </div>
               </li>

               <li className={is_delivered ? "payway_item" : "payway_item payway--disabled"}>
                  <PaySelector opt={"cash"} onClick={handlePaywaySwitch} selected={payWay === "cash"} disabled={is_delivered === false} />
                  <div className="payway_content">
                     <p className="main_content">Наличными курьеру</p>
                     <p className="sub_content">при получении</p>
                  </div>
               </li>
               <li className={is_delivered ? "payway_item" : "payway_item payway--disabled"}>
                  <PaySelector
                     opt={"withCardRunner"}
                     onClick={handlePaywaySwitch}
                     selected={payWay === "withCardRunner"}
                     disabled={is_delivered === false}
                  />
                  <div className="payway_content">
                     <p className="main_content">Картой курьеру</p>
                     <p className="sub_content">при получении</p>
                  </div>
               </li>
            </ul>
            <div className="email_inp">
               <p className="field_title">Почта*</p>
               <FormInput
                  name={"email"}
                  type={"email"}
                  placeholder={"example@mail.ru"}
                  setV={setFormValues}
                  fieldValidationFn={minLengthValidation}
                  onBlurValue={""}
                  minLength={5}
                  Regexp={null}
                  formValue={formValues["email"]}
               />
            </div>
            <div className="username_inp">
               <p className="field_title">Полное имя*</p>
               <FormInput
                  name={"username"}
                  type={"text"}
                  placeholder={"Иван Иванов"}
                  setV={setFormValues}
                  fieldValidationFn={minLengthValidation}
                  onBlurValue={""}
                  minLength={5}
                  Regexp={new RegExp("[A-Za-z]|\\d|[.,)(*&^%$#@!-=`'<>]")}
                  formValue={formValues["username"]}
               />
            </div>
            <p className="check_warn">
               Эти данные необходимы для <br />
               формирования и отправки чека
            </p>
            <div className="promo_inp">
               <p className="field_title">
                  Промокод <small>(не обязательно)</small>
               </p>
               <FormInput
                  name={"promo"}
                  type={"text"}
                  placeholder={"100RUBLEI"}
                  setV={setFormValues}
                  fieldValidationFn={minLengthValidation}
                  onBlurValue={""}
                  minLength={5}
                  Regexp={null}
                  formValue={formValues["promo"]}
               />
            </div>
         </div>
         {pay && <SubmitOrderButton isActive={isSubmitButtonActive} handler={handleOrderCreation} />}
      </div>
   );
};

export default React.memo(Pay);
