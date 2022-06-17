import React, {useState} from 'react';
import {useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../../../redux";
import CancelOrderForm from "./cancelForm/CancelOrderForm";
import {CancelOrderFormState, useCancelOrderForm} from "./hooks/useCancelOrderForm";
import "../../../order/orderForm/order-form.styles.scss"
import "./cancel-order.styles.scss"
import {CancelExplanationPresets} from "../../../../types/types";
import {useCancelMasterOrder} from "./hooks/useCancelMasterOrder";

const CancelOrderModal = () => {
    const {worker} = useAppSelector(windowSelector)

    const dispatch = useAppDispatch()

    const {
        formValues,
        setFormDefaults,
        setFormValues,
        cancellable,
        getFormValues
    } = useCancelOrderForm()

    const {cancelMasterOrder} = useCancelMasterOrder()

    async function handleOrderCancellation(){
        if(!cancellable) { return }

        const body = getFormValues()
        await cancelMasterOrder(body)
        dispatch(windowActions.toggleCancelOrder())
    }

    const [explanationSet, setExplanationSet] = useState<CancelExplanationPresets>(CancelExplanationPresets.CUSTOMER_WILL)
    const [isCustomExplFieldActive, setIsCustomExplFieldActive] = useState<boolean>(false)

    function affectRealFormValuesWithExplanationSet(set: CancelExplanationPresets){
        setFormValues((state: CancelOrderFormState) => {
            return {...state, cancelExplanation:set}
        })
    }

    function setExplanationPreset(value: CancelExplanationPresets): void {
        switch (value){
            case CancelExplanationPresets.CUSTOM:
                setExplanationSet(CancelExplanationPresets.CUSTOM)
                affectRealFormValuesWithExplanationSet("" as CancelExplanationPresets)
                setIsCustomExplFieldActive(true)
                return
            case value:
                setExplanationSet(value)
                affectRealFormValuesWithExplanationSet(value)
                setIsCustomExplFieldActive(false)
                return
        }
    }


    return (
        <div className={worker.cancelOrder ? "worker_modal cancel --w-opened" : "worker_modal"}>
            <div>
                <p className='modal_title'>Отменить заказ</p>
                <CancelOrderForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                    setFormDefaults={setFormDefaults}
                    setExplanationPreset={setExplanationPreset}
                />
                <span className="cancel_container">
                    <p>Причина отмены</p>
                     <select
                         name="cancelExplanationSelect"
                         value={explanationSet}
                         className="cancel_explanation_select"
                         onChange={(event) =>{
                             setExplanationPreset(event.target.value as CancelExplanationPresets)
                         }}>

                        <option value={CancelExplanationPresets.CUSTOMER_WILL}>По инициативе заказчика</option>
                        <option value={CancelExplanationPresets.SYSTEM_ERROR}>Ошибка в системе</option>
                        <option value={CancelExplanationPresets.ORDER_ERROR}>Ошибка в заказе</option>
                        <option value={CancelExplanationPresets.CUSTOM}>Своя причина</option>
                    </select>
                </span>
                <textarea
                    className={isCustomExplFieldActive ? "cancel_explanation_area --area-active" : "cancel_explanation_area"}
                    placeholder="Своя причина отмены"
                    value={formValues.cancelExplanation}
                    onChange={(e) => setFormValues((state:CancelOrderFormState) => {
                        return {...state, cancelExplanation:e.target.value}
                    })}
                />
            </div>
            <div>
                <div className="cancel_status">
                    <p>Заказ</p>
                    <p>
                        {
                            cancellable ?
                            "Может быть отменен" :
                            "Не может быть отменен"
                        }
                    </p>
                </div>
                <button onClick={handleOrderCancellation} className='modal_button cancel'>Отменить заказ</button>
            </div>
        </div>
    );
};

export default React.memo(CancelOrderModal);