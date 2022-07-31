import React, { FC, useEffect, useMemo, useState } from "react";
import FormInput from "../../ui/formInput/FormInput";
import { useFormValidations } from "../../../hooks/useFormValidations";
import "./order-form.styles.scss";
import { UserOrderFormState } from "../CreateUserOrder";
import EventEmitter from "events";
import { useAppSelector, userSelector } from "../../../redux";
import { useEvents } from "../../../hooks/useEvents";
import { DeliveryDetails } from "../../../common/types";
import { useAppCookies } from "../../../hooks/useAppCookies";
import { useUser } from "../../../hooks/useUser";

interface orderFormProps {
   formValues: UserOrderFormState;
   setFormValues: Function;
}

interface autocomplete {
   phone_number: boolean;
   address: boolean;
   entrance_number: boolean;
   floor: boolean;
   flat_call: boolean;
}

const defaults: autocomplete = {
   address: false,
   entrance_number: false,
   flat_call: false,
   phone_number: false,
   floor: false
};

const OrderForm: FC<orderFormProps> = ({ formValues, setFormValues }) => {
   const isDeliveryFormDisabledExpr = formValues["is_delivered"].value ? "" : "--disabled ";
   const { validatePhoneNumber, minLengthValidation } = useFormValidations();

   const [opt1, opt2] = ["скажу по телефону", "в ближайшее время"];
   const [selectV, setSelectV] = useState<string>(opt1);
   const { isAuthenticated } = useAppSelector(userSelector);
   const { phone_number, delivery_details } = useUser();
   console.log(phone_number, delivery_details);
   const events = useEvents();

   const [autoComplete, setAutocomplete] = useState<autocomplete>(defaults);

   useEffect(() => {
      if (isAuthenticated) {
         registerEvents();
      }
   }, [isAuthenticated]);

   function registerEvents() {
      if (phone_number) {
         registerAutocompleteEvent("phone_number");
      }

      //Register autocomplete only if user has remembered delivery address
      if (delivery_details) {
         registerAutocompleteEvent("address");
         registerAutocompleteEvent("floor");
         registerAutocompleteEvent("flat_call");
         registerAutocompleteEvent("entrance_number");
      }
   }

   function registerAutocompleteEvent(name: string) {
      events.on(`autocomplete_${name}`, () => {
         if (isAuthenticated) {
            setAutocomplete((s: autocomplete) => {
               const copy = Object.assign({}, s);
               const k: keyof autocomplete = `${name}` as keyof autocomplete;
               copy[k] = true;
               return { ...copy };
            });
         }
      });
      events.on(`blur_${name}`, () => {
         if (isAuthenticated) {
            setAutocomplete((s: autocomplete) => {
               const copy = Object.assign({}, s);
               const k: keyof autocomplete = `${name}` as keyof autocomplete;
               copy[k] = false;
               return { ...copy };
            });
         }
      });
   }

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

   function handleAutocomplete(name: keyof autocomplete) {
      if (name === "phone_number") {
         setFormValues((prev: UserOrderFormState) => {
            const copy = Object.assign({}, prev);
            copy.phone_number = {
               value: phone_number.split("").splice(2, phone_number.length).join(""),
               isValid: true
            };
            return { ...copy };
         });
         return;
      }
      setFormValues((state: UserOrderFormState) => {
         const copy = Object.assign({}, state);
         copy[name] = {
            isValid: true,
            value: String(delivery_details[name as keyof DeliveryDetails])
         };
         return { ...copy };
      });
      return;
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
            {delivery_details && autoComplete["address"] && (
               <div onClick={() => handleAutocomplete("address")} className="autocomplete address">
                  <p>{delivery_details.address}</p>
               </div>
            )}
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
               {delivery_details && autoComplete["entrance_number"] && (
                  <div onClick={() => handleAutocomplete("entrance_number")} className="autocomplete entrance_number">
                     <p>{delivery_details.entrance_number}</p>
                  </div>
               )}

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
               {delivery_details && autoComplete["flat_call"] && (
                  <div onClick={() => handleAutocomplete("flat_call")} className="autocomplete flat_call">
                     <p>{delivery_details.flat_call}</p>
                  </div>
               )}

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
               {delivery_details && autoComplete["floor"] && (
                  <div onClick={() => handleAutocomplete("floor")} className="autocomplete floor">
                     <p>{delivery_details.floor}</p>
                  </div>
               )}
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
               maxLength={10}
               fieldValidationFn={validatePhoneNumber}
               Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
               extraClassName={"phone_number_input"}
               minLength={10}
            />
            {autoComplete["phone_number"] && (
               <div onClick={() => handleAutocomplete("phone_number")} className="autocomplete phone">
                  <p>{phone_number}</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default React.memo(OrderForm);
