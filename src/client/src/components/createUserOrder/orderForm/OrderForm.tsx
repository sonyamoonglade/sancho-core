import React, { FC, useState } from "react";
import FormInput from "../../formInput/FormInput";
import { useFormValidations } from "../../../hooks/useFormValidations";
import "./order-form.styles.scss";
import { UserOrderFormState } from "../Order";
import EventEmitter from "events";
import { useAppSelector, userSelector } from "../../../redux";

interface orderFormProps {
   formValues: UserOrderFormState;
   setFormValues: Function;
}

const OrderForm: FC<orderFormProps> = ({ formValues, setFormValues }) => {
   const isDeliveryFormDisabledExpr = formValues["is_delivered"].value ? "" : "--disabled ";
   const { validatePhoneNumber, minLengthValidation } = useFormValidations();

   const [opt1, opt2] = ["скажу по телефону", "в ближайшее время"];
   const [selectV, setSelectV] = useState<string>(opt1);
   const { isAuthenticated, phoneNumber } = useAppSelector(userSelector);

   const emitter = new EventEmitter();

   function handleSelectChange(event: any) {
      const v = event.target.value;
      switch (true) {
         case v === opt1:
            setSelectV(opt1);
            setFormValues((state: UserOrderFormState) => {
               const obj = state.is_delivered_asap;
               obj.value = false;
               return { ...state, is_delivered_asap: obj };
            });
            break;
         case v === opt2:
            setFormValues((state: UserOrderFormState) => {
               const obj = state.is_delivered_asap;
               obj.value = true;
               return { ...state, is_delivered_asap: obj };
            });
            setSelectV(opt2);
            break;
      }
   }

   const [show, setShow] = useState<boolean>(false);

   emitter.on("autocomplete", () => {
      if (isAuthenticated) {
         setShow(true);
      }
   });
   emitter.on("blur", () => {
      if (isAuthenticated) {
         setShow(false);
      }
   });

   function handleAutoCompleteClick() {
      setFormValues((prev: UserOrderFormState) => {
         const obj = prev.phone_number;
         obj.value = phoneNumber.split("").splice(2, phoneNumber.length).join("");
         obj.isValid = true;
         return { ...prev, phone_number: obj };
      });
   }

   return (
      <div className="order_form">
         <div className="delivery_input">
            <div className="is_delivered_checkbox">
               <p className={isDeliveryFormDisabledExpr}>Нужна доставка?</p>
               <input
                  checked={formValues.is_delivered.value}
                  name={"is_delivered"}
                  onChange={() => {
                     setFormValues((state: UserOrderFormState) => {
                        const obj = state.is_delivered;
                        obj.value = !obj.value;
                        return { ...state, is_delivered: obj };
                     });
                  }}
                  type="checkbox"
               />
            </div>
            <FormInput
               name={"address"}
               type={"text"}
               placeholder={"Пушкинская 29а"}
               formValue={formValues["address"]}
               setV={setFormValues}
               onBlurValue={"ул."}
               minLength={5}
               maxLength={100}
               extraClassName={`${isDeliveryFormDisabledExpr}address_input`}
               Regexp={new RegExp("[_!\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
               fieldValidationFn={minLengthValidation}
            />
            <div className="delivery_details_container">
               <FormInput
                  name={"entrance_number"}
                  type={"text"}
                  placeholder={"1"}
                  formValue={formValues["entrance_number"]}
                  setV={setFormValues}
                  onBlurValue={"подъезд"}
                  maxLength={2}
                  minLength={1}
                  extraClassName={`${isDeliveryFormDisabledExpr}entrance_number_input`}
                  Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                  fieldValidationFn={minLengthValidation}
               />

               <FormInput
                  name={"flat_call"}
                  type={"text"}
                  placeholder={"5"}
                  formValue={formValues["flat_call"]}
                  setV={setFormValues}
                  onBlurValue={"кв."}
                  maxLength={3}
                  minLength={1}
                  extraClassName={`${isDeliveryFormDisabledExpr}flat_call_input`}
                  Regexp={new RegExp("[A-Za-z]")}
                  fieldValidationFn={minLengthValidation}
               />

               <FormInput
                  name={"floor"}
                  type={"text"}
                  placeholder={"9"}
                  formValue={formValues["floor"]}
                  setV={setFormValues}
                  onBlurValue={"этаж "}
                  maxLength={2}
                  minLength={1}
                  extraClassName={`${isDeliveryFormDisabledExpr}floor_input`}
                  Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                  fieldValidationFn={minLengthValidation}
               />
            </div>
         </div>
         <FormInput
            name={"comment"}
            type={"text"}
            placeholder={"Комментарий курьеру"}
            formValue={formValues["comment"]}
            setV={setFormValues}
            onBlurValue={""}
            maxLength={30}
            minLength={3}
            fieldValidationFn={minLengthValidation}
            extraClassName={`${isDeliveryFormDisabledExpr}comment`}
         />
         <div className={`delivered_at select_container ${isDeliveryFormDisabledExpr}`}>
            <p className="delivered_at_title">Когда доставить?</p>
            <select value={selectV} onChange={handleSelectChange} className="delivered_at_select">
               <option value={opt1}>{opt1}</option>
               <option value={opt2}>{opt2}</option>
            </select>
         </div>
         <div className="contacts_input">
            <div className="contacts_title">
               <p className="contacts_phone_title">Номер телефона</p>
               <small>
                  <i>*После оформления заказа мы позвоним вам для подтверждения</i>
               </small>
            </div>
            <FormInput
               name={"phone_number"}
               type={"text"}
               placeholder={"9524000770"}
               formValue={formValues["phone_number"]}
               setV={setFormValues}
               onBlurValue={"+7"}
               emitter={emitter}
               maxLength={10}
               fieldValidationFn={validatePhoneNumber}
               Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
               extraClassName={"phone_number_input"}
               minLength={10}
            />
            {show ? (
               <div
                  onClick={() => {
                     handleAutoCompleteClick();
                  }}
                  className="autocomplete">
                  <p>{phoneNumber}</p>
               </div>
            ) : null}
         </div>
      </div>
   );
};

export default React.memo(OrderForm);
