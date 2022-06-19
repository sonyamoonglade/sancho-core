import React, {FC} from 'react';
import FormInput from "../../formInput/FormInput";
import {useFormValidations} from "../../../hooks/useFormValidations";

import './order-form.styles.scss'
import {UserOrderFormState} from "../Order";


interface orderFormProps {
    formValues: UserOrderFormState
    setFormValues: Function
}
const OrderForm:FC<orderFormProps> = ({formValues,setFormValues}) => {

    const isDeliveryFormDisabledExpr = formValues["is_delivered"].value ? "" : "--disabled "
    const {validatePhoneNumber, minLengthValidation} = useFormValidations()


    return (
        <div className='order_form' >
            <div className="delivery_input">
                <div className="is_delivered_checkbox">
                    <p className={isDeliveryFormDisabledExpr}>Нужна доставка?</p>
                    <input
                        checked={formValues.is_delivered.value}
                        name={"is_delivered"} onChange={() => {
                        setFormValues((state:UserOrderFormState) => {
                            const obj = state.is_delivered
                            obj.value = !obj.value
                            return {...state,is_delivered:obj}
                        })
                    }} type="checkbox"
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
            <div className={`delivered_at_select_container ${isDeliveryFormDisabledExpr}`}>
                <p className="delivered_at_title">Когда доставить?</p>
                <select className="delivered_at_select">
                    <option>скажу по телефону</option>
                    <option>в ближайшее время</option>
                </select>
            </div>
            <div className="contacts_input">
                <div className='contacts_title'>
                    <p className='contacts_phone_title'>Номер телефона</p>
                    <small><i>*После оформления заказа мы позвоним вам для подтверждения</i></small>
                </div>
                <FormInput
                    name={'phone_number'}
                    type={'text'}
                    placeholder={'9524000770'}
                    formValue={formValues["phone_number"]}
                    setV={setFormValues}
                    onBlurValue={'+7'}
                    maxLength={10}
                    fieldValidationFn={validatePhoneNumber}
                    Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                    extraClassName={"phone_number_input"}
                    minLength={10}

                />
            </div>
        </div>

    );
};

export default OrderForm;