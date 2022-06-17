import React, {FC, useEffect, useMemo} from 'react';
import FormInput from "../../../../formInput/FormInput";
import {useAppSelector, windowSelector} from "../../../../../redux";
import {useFormValidations} from "../../../../../hooks/useFormValidations";
import {WorkerVerifyOrderFormState} from "../hooks/useVerifyOrderForm";




interface submitOrderFormProps {
    formValues: WorkerVerifyOrderFormState,
    setFormValues: Function
    setFormDefaults: Function
    presetDeliveryDetails: Function
    setFormDefaultsExceptPhoneNumberAndFullname: Function
}

const VerifyOrderForm:FC<submitOrderFormProps> = ({formValues,setFormDefaults,setFormValues,presetDeliveryDetails,setFormDefaultsExceptPhoneNumberAndFullname}) => {
    const {worker} = useAppSelector(windowSelector)

    const {validatePhoneNumber,minLengthValidation} = useFormValidations()

    const isDeliveryFormDisabledExpr = useMemo(() => {
        return formValues["is_delivered_w"].value ? "delivery_text_w " : "--disabled w "
    },[formValues])



    useEffect(() => {
        if(!worker.verifyOrder){
            setFormDefaults()
        }
    },[worker.verifyOrder])
    useEffect(() => {
        if(formValues.phone_number_w.isValid){
            presetDeliveryDetails()
        }else {
            setFormDefaultsExceptPhoneNumberAndFullname()
        }
    },[formValues.phone_number_w.isValid])

    return (
        <>
            <FormInput
                name={"verified_fullname_w"}
                type={"text"}
                placeholder={"Полное имя заказчика"}
                formValue={formValues["verified_fullname_w"]}
                setV={setFormValues}
                extraClassName={`verified_fullname_input w`}
                fieldValidationFn={minLengthValidation}
                onBlurValue={""}
                minLength={8}
                maxLength={100}
                isActiveForValidation={worker.verifyOrder}
            />

            <FormInput
                name={'phone_number_w'}
                type={'text'}
                placeholder={'Номер телефона'}
                formValue={formValues["phone_number_w"]}
                setV={setFormValues}
                onBlurValue={'+7'}
                maxLength={10}
                fieldValidationFn={validatePhoneNumber}
                Regexp={new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]")}
                minLength={10}

            />

            <div className="delivery_input w">
                <div className="is_delivered_checkbox w">
                    <p className={isDeliveryFormDisabledExpr}>Нужна доставка?</p>
                    <input
                        checked={formValues.is_delivered_w.value}
                        name={"is_delivered_ц"} onChange={() => {
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
                    formValue={formValues["address_w"]}
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
                        formValue={formValues["entrance_number_w"]}
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
                        formValue={formValues["flat_call_w"]}
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
                        formValue={formValues["floor_w"]}
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

export default VerifyOrderForm;