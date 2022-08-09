import React, { useEffect, useMemo } from "react";
import {
  orderSelector,
  productActions,
  useAppDispatch,
  useAppSelector,
  userSelector,
  windowActions,
  windowSelector,
} from "../../redux";
import "./pay.styles.scss";
import { TiArrowBack } from "react-icons/ti";
import { baseUrl } from "../../App";
import PaySelector from "../ui/paySelector/PaySelector";
import { CreateUserOrderDto, DeliveryDetails } from "../../common/types";
import FormInput from "../ui/formInput/FormInput";
import { CLEAR_ORDER_FORM, CLEAR_ORDER_FORM_ONLY_PHONE } from "../../types/types";
import { useFormValidations } from "../../hooks/useFormValidations";
import SubmitOrderButton from "../createUserOrder/submitOrderButton/SubmitOrderButton";
import { usePayForm } from "./hooks/usePayForm";
import { useAxios } from "../../hooks/useAxios";
import { useCreateOrder } from "../createUserOrder/hooks/useCreateOrder";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useCart } from "../../hooks/useCart";
import { useEvents } from "../../hooks/useEvents";
import { useUser } from "../../hooks/useUser";
import { useAppCookies } from "../../hooks/useAppCookies";

const Pay = () => {
   const { pay } = useAppSelector(windowSelector);

   const dispatch = useAppDispatch();

   function togglePay() {
      dispatch(windowActions.togglePay(false));
   }

   const { minLengthValidation } = useFormValidations();

   const { setFormValues, handlePaywaySwitch, formValues, payWay, getFormValues, setFormDefaults } = usePayForm();
   const { userOrder: orderData } = useAppSelector(orderSelector);
   const cart = useCart();
   const events = useEvents();
   const client = useAxios();
   const { createUserOrder } = useCreateOrder(client);
   const { login } = useAuthentication(client);
   const { isAuthenticated } = useAppSelector(userSelector);
   const { phone_number: userPhoneNumber } = useUser();
   const { phoneNumber: phCookie, deliveryDetails: deliv_dCookie } = useAppCookies();
   const is_delivered = orderData?.is_delivered;
   useEffect(() => {
      if (pay) {
         setFormDefaults();
      }
   }, [pay]);
   const isSubmitButtonActive = useMemo(() => {
      if (payWay === "online") {
         return formValues.email.isValid && formValues.username.isValid;
      }
      return true;
   }, [formValues, payWay]);
   async function handleOrderCreation() {
      const { phone_number: phoneNumber } = orderData;
      try {
         if (!isAuthenticated) {
            await login(phoneNumber);
            //After successful login set a phoneNumber cookie
            phCookie.set(phoneNumber);
         } else if (phoneNumber !== userPhoneNumber) {
            await login(phoneNumber);
            //After successful login set a phoneNumber cookie
            phCookie.set(phoneNumber);
         }
      } catch (e: any) {
         events.emit(CLEAR_ORDER_FORM_ONLY_PHONE);
         const message = e?.response?.data?.message;
         dispatch(windowActions.startErrorScreenAndShowMessage(message || "Ошибочка..."));
      }

      try {
         const data = getFormValues();
         const { cart: usrCart, is_delivered_asap, delivery_details, is_delivered } = orderData;

         // delivery_details is null if order is not delivered
         if (is_delivered) {
            //Prepare JSON string for a cookie.
            const detailsWithoutCommAndDlvAt: DeliveryDetails = {
               address: delivery_details.address,
               floor: delivery_details.floor,
               flat_call: delivery_details.flat_call,
               entrance_number: delivery_details.entrance_number
            };
            const json = JSON.stringify(detailsWithoutCommAndDlvAt);

            //After click on 'Оформить заказ' set a deliveryDetails cookie
            deliv_dCookie.set(json);
         }

         const createOrderDto: CreateUserOrderDto = {
            cart: usrCart,
            delivery_details,
            is_delivered,
            is_delivered_asap,
            pay: payWay
         };
         //Only if user selects online we need it's personal data (email, username)
         if (payWay === "online") {
            createOrderDto.email = data.email;
            createOrderDto.username = data.username;
         }
         //validate promo here
         if (data.promo) {
            createOrderDto.promo = data.promo;
         }

         //todo: utilize redirect
         const { redirect_url } = await createUserOrder(createOrderDto);

         // //Redirect user to pay page
         // setTimeout(() => {
         //    window.location.replace(redirect_url);
         // }, loadingDuration + animationPeriod);

         //Order has created successfully. Clear up previous form and cart
         cart.clearCart();
         events.emit(CLEAR_ORDER_FORM);
         dispatch(productActions.setCartEmpty(true));
         dispatch(productActions.setTotalCartPrice(0));
      } catch (e: any) {
         //Error creating an order. Clear only phone for UX
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
                  <PaySelector opt={"online"} onClick={handlePaywaySwitch} selected={payWay === "online"} disabled={false} />
                  <div className="payway_content">
                     <p className="main_content">Банковской картой</p>
                     <img className="card_payment_icon" src={`${baseUrl}/card-payment.png`} alt="payment" />
                  </div>
               </li>

               <li className={is_delivered ? "payway_item" : "payway_item payway--disabled"}>
                  <PaySelector opt={"onPickup"} onClick={handlePaywaySwitch} selected={payWay === "onPickup"} disabled={is_delivered === false} />
                  <div className="payway_content">
                     <p className="main_content">При получении</p>
                     <p className="sub_content">картой или наличными</p>
                  </div>
               </li>
            </ul>
            <div className={payWay === "onPickup" ? "email_inp --disabled" : "email_inp"}>
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
            <div className={payWay === "onPickup" ? "username_inp --disabled" : "username_inp"}>
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
