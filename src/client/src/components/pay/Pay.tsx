import React from "react";
import { orderSelector, useAppDispatch, useAppSelector, windowActions, windowSelector } from "../../redux";
import "./pay.styles.scss";
import { TiArrowBack } from "react-icons/ti";
import { baseUrl } from "../../App";
import PaySelector from "../ui/paySelector/PaySelector";
const Pay = () => {
   const { pay } = useAppSelector(windowSelector);

   const dispatch = useAppDispatch();

   function togglePay() {
      dispatch(windowActions.togglePay(false));
   }

   const { isUsrOrderDelivered } = useAppSelector(orderSelector);

   return (
      <div className={pay ? "pay modal modal--visible" : "pay modal"}>
         <div className="pay_header">
            <TiArrowBack onClick={() => togglePay()} className="cart_back_icon" size={30} />
            <p>Оплата</p>
         </div>
         <div className="pay_container">
            <p className="pay_title">Как хотите оплатить заказ?</p>
            <ul className="pay_way">
               <li className="payway_item">
                  <PaySelector selected={true} disabled={false} />
                  <div className="payway_content">
                     <p className="main_content">Банковской картой</p>
                     <img className="card_payment_icon" src={`${baseUrl}/card-payment.png`} alt="payment" />
                  </div>
               </li>

               <li className="payway_item">
                  <PaySelector selected={false} disabled={true} />
                  <div className="payway_content">
                     <p className="main_content">Наличными курьеру</p>
                     <p className="sub_content">при получении</p>
                  </div>
               </li>
               <li className="payway_item">
                  <PaySelector selected={false} disabled={true} />
                  <div className="payway_content">
                     <p className="main_content">Картой курьеру</p>
                     <p className="sub_content">при получении</p>
                  </div>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default Pay;
