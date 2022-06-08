import React, {useEffect, useState} from 'react';
import {fetchOrderQueue, useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../redux";
import FormInput from "../../formInput/FormInput";
import {useFormValidations} from "../../../hooks/useFormValidations";
import "./submit-order.styles.scss"
import "../../order/orderForm/order-form.styles.scss"
import {RiSettings4Line} from "react-icons/ri";
import {UserOrderFormState, UserOrderFormValuesInterface} from "../../order/userOrder/Order";
import {useAxios} from "../../../hooks/useAxios";
const SubmitOrderModal = () => {


    const {worker} = useAppSelector(windowSelector)
    const {validatePhoneNumber,minLengthValidation} = useFormValidations()
    const [formValues,setFormValues] = useState({
        verified_fullname_w:{
            value: "",
            isValid: false
        },
        phone_number_w:{
            value: "",
            isValid: false
        },
        address_w: {
            value:"",
            isValid: false
        },
        entrance_number_w: {
            value:"",
            isValid: false
        },
        flat_call_w: {
            value:"",
            isValid: false
        },
        floor_w: {
            value:"",
            isValid: false
        },
        is_delivered_w: {
            value: false,
            isValid: true
        },

    })
    const isDeliveryFormDisabledExpr = formValues["is_delivered_w"].value ? "delivery_text_w " : "--disabled w "
    const dispatch = useAppDispatch()
    const {client} = useAxios()

    async function handleOrderVerification(){
        try {
            const body = getFormValues()
            const response = await client.put("order/verifyOrder", body)
            if(response.status === 200){
                dispatch(windowActions.toggleSubmitOrder())
            }
        }catch (e) {
            console.log(e)
            alert(e)
        }
    }

    function getFormValues(){
        return {
            phone_number:`+7${formValues.phone_number_w.value}`,
            is_delivered: formValues.is_delivered_w.value,
            verified_fullname: formValues.verified_fullname_w.value,
            delivery_details: {
                address: formValues.address_w.value,
                flat_call: Number(formValues.flat_call_w.value),
                entrance_number: Number(formValues.entrance_number_w.value),
                floor: Number(formValues.floor_w.value)
            }
        }
    }


    useEffect(() => {

    },[])

    return (
        <div className={worker.submitOrder ? 'worker_modal --w-opened': 'worker_modal'}>

            <p className='submit_title'>Подтвердить заказ</p>
            <RiSettings4Line className='submit_settings' size={25} />
            <FormInput
                name={"verified_fullname_w"}
                type={"text"}
                placeholder={"Полное имя заказчика"}
                v={formValues["verified_fullname_w"].value}
                setV={setFormValues}
                extraClassName={`verified_fullname_input w`}
                fieldValidationFn={minLengthValidation}
                onBlurValue={""}
                minLength={8}
                maxLength={100}
            />

            <FormInput
                name={'phone_number_w'}
                type={'text'}
                placeholder={'Номер телефона'}
                v={formValues["phone_number_w"].value}
                setV={setFormValues}
                onBlurValue={'+7'}
                maxLength={10}
                fieldValidationFn={validatePhoneNumber}
                Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                minLength={10}

            />

            <div className="delivery_input w">
                <div className="is_delivered_checkbox w">
                    <p className={isDeliveryFormDisabledExpr}>Нужна доставка?</p>
                    <input
                        checked={formValues.is_delivered_w.value}
                        name={"is_delivered"} onChange={() => {
                        setFormValues((state: any) => {
                            const obj = state.is_delivered_w
                            obj.value = !obj.value
                            return {...state,is_delivered_w:obj}
                        })
                    }} type="checkbox"
                    />
                </div>
                <FormInput
                    name={"address_w"}
                    type={"text"}
                    placeholder={"Адрес доставки"}
                    v={formValues["address_w"].value}
                    setV={setFormValues}
                    onBlurValue={"ул."}
                    minLength={5}
                    maxLength={100}
                    extraClassName={`${isDeliveryFormDisabledExpr}address_input w`}
                    Regexp={new RegExp("[_!\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                    fieldValidationFn={minLengthValidation}

                />

                <div className="delivery_details_container">
                    <FormInput
                        name={"entrance_number_w"}
                        type={"text"}
                        placeholder={"1"}
                        v={formValues["entrance_number_w"].value}
                        setV={setFormValues}
                        onBlurValue={"подъезд"}
                        maxLength={2}
                        minLength={1}
                        extraClassName={`${isDeliveryFormDisabledExpr}entrance_number_input w`}
                        Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                        fieldValidationFn={minLengthValidation}

                    />

                    <FormInput
                        name={"flat_call_w"}
                        type={"text"}
                        placeholder={"5"}
                        v={formValues["flat_call_w"].value}
                        setV={setFormValues}
                        onBlurValue={"кв."}
                        maxLength={3}
                        minLength={1}
                        extraClassName={`${isDeliveryFormDisabledExpr}flat_call_input w`}
                        Regexp={new RegExp("[A-Za-z]")}
                        fieldValidationFn={minLengthValidation}

                    />

                    <FormInput
                        name={"floor_w"}
                        type={"text"}
                        placeholder={"9"}
                        v={formValues["floor_w"].value}
                        setV={setFormValues}
                        onBlurValue={"этаж "}
                        maxLength={2}
                        minLength={1}
                        extraClassName={`${isDeliveryFormDisabledExpr}floor_input w`}
                        Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                        fieldValidationFn={minLengthValidation}
                    />

                </div>
            </div>
            <button onClick={handleOrderVerification} className='modal_button'>Подтвердить</button>
        </div>
    );
};

export default SubmitOrderModal;