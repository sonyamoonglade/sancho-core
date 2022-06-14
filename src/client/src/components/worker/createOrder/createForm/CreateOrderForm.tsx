import React, {useEffect, useMemo} from 'react';
import {useCreateOrderForm, WorkerCreateOrderFormState} from "../hooks/useCreateOrderForm";
import FormInput from "../../../formInput/FormInput";
import {useFormValidations} from "../../../../hooks/useFormValidations";
import {useAppSelector, windowSelector} from "../../../../redux";



const CreateOrderForm = () => {

    const {worker} = useAppSelector(windowSelector)

    const {
        formValues,
        setFormDefaults,
        setFormValues
    } = useCreateOrderForm()

    const {minLengthValidation,validatePhoneNumber} = useFormValidations()

    useEffect(() => {
        if(!worker.createOrder){
            setFormDefaults()
        }
    },[worker.createOrder])

    const isDeliveryFormDisabledExpr = useMemo(() => {
        return formValues["is_delivered_c"].value ? "delivery_text_w " : "--disabled w "
    },[formValues.is_delivered_c.value])


    return (
        <>



            <FormInput
                name={"verified_fullname_c"}
                type={"text"}
                placeholder={"Полное имя заказчика"}
                formValue={formValues["verified_fullname_c"]}
                setV={setFormValues}
                extraClassName={`verified_fullname_input w`}
                fieldValidationFn={minLengthValidation}
                onBlurValue={""}
                minLength={8}
                maxLength={100}
                isActiveForValidation={worker.verifyOrder}
            />

            <FormInput
                name={'phone_number_c'}
                extraClassName={"phone_number_input c"}
                type={'text'}
                placeholder={'Номер телефона'}
                formValue={formValues["phone_number_c"]}
                setV={setFormValues}
                onBlurValue={'+7'}
                maxLength={10}
                fieldValidationFn={validatePhoneNumber}
                Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]")}
                minLength={10}

            />

            <div className="delivery_input w c">
                <div className="is_delivered_checkbox w">
                    <p className={isDeliveryFormDisabledExpr}>Нужна доставка?</p>
                    <input
                        checked={formValues.is_delivered_c.value}
                        name={"is_delivered_с"} onChange={() => {
                        setFormValues((state: WorkerCreateOrderFormState) => {
                            const obj = state.is_delivered_c
                            obj.value = !obj.value
                            return {...state,is_delivered_c:obj}
                        })
                    }} type="checkbox"
                    />
                </div>
                <FormInput
                    name={"address_c"}
                    type={"text"}
                    placeholder={"Адрес доставки"}
                    formValue={formValues["address_c"]}
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
                        name={"entrance_number_c"}
                        type={"text"}
                        placeholder={"1"}
                        formValue={formValues["entrance_number_c"]}
                        setV={setFormValues}
                        onBlurValue={"подъезд"}
                        maxLength={2}
                        minLength={1}
                        extraClassName={`${isDeliveryFormDisabledExpr}entrance_number_input w`}
                        Regexp={new RegExp("[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+")}
                        fieldValidationFn={minLengthValidation}

                    />

                    <FormInput
                        name={"flat_call_c"}
                        type={"text"}
                        placeholder={"5"}
                        formValue={formValues["flat_call_c"]}
                        setV={setFormValues}
                        onBlurValue={"кв."}
                        maxLength={3}
                        minLength={1}
                        extraClassName={`${isDeliveryFormDisabledExpr}flat_call_input w`}
                        Regexp={new RegExp("[A-Za-z]")}
                        fieldValidationFn={minLengthValidation}

                    />

                    <FormInput
                        name={"floor_c"}
                        type={"text"}
                        placeholder={"9"}
                        formValue={formValues["floor_c"]}
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

        </>
    );
};

export default CreateOrderForm;