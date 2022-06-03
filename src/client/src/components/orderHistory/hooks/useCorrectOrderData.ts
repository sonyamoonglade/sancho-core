import {useMemo, useState} from "react";
import {OrderStatus, ResponseUserOrder} from "../../../common/types";
import {DATE_FORMAT_TEMPLATE, OrderStatusTranslate} from "../../../types/types";
import dayjs from "dayjs";


export function useCorrectOrderData (order:ResponseUserOrder){
    const [cid, setCid] = useState("")
    const [cstatus,setCStatus] = useState("")
    const [cdate, setCDate] = useState("")

    const orderItemCorrespondingClassName = useMemo(() => {
       return order.status === OrderStatus.waiting_for_verification ?
            "--yellow order_h_item" :
            order.status === OrderStatus.verified ?
                "--green order_h_item" :
                order.status === OrderStatus.cancelled ?
                    "--red order_h_item" :
                    order.status === OrderStatus.completed ?
                        "--blue order_h_item" :
                        "order_h_item"
    },[order])
    const monthTranslations = new Map<string,string>()
    function sixifyOrderId(){
        let currentId:string[] = order.id.toString().split("")
        for(let i = 0; i < 6; i++){
            if(currentId.length !== 6){
                currentId.unshift("0")
            }
        }
        setCid(currentId.join(""))
    }
    function translateStatus(){
        switch (order.status){
            case OrderStatus.cancelled:
                setCStatus(OrderStatusTranslate.cancelled)
                break
            case OrderStatus.completed:
                setCStatus(OrderStatusTranslate.completed)
                break
            case OrderStatus.verified:
                setCStatus(OrderStatusTranslate.verified)
                break
            case OrderStatus.waiting_for_verification:
                setCStatus(OrderStatusTranslate.waiting_for_verification)
                break
        }
    }
    function parseCreationTime(){
        const createdAt = dayjs(order.created_at)
        const formatted = createdAt.format(DATE_FORMAT_TEMPLATE).split(" ")
        let indexOfMonth = 1
        const currMonth = formatted[indexOfMonth]
        formatted[indexOfMonth] = monthTranslations.get(currMonth) // getting translation
        const output = formatted.join(" ")
        setCDate(output)
    }
    function setupMonthTranslations(){
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        const translations = ["Янв","Фев","Мар","Апр","май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"]
        for(let i = 0; i < months.length; i++){
            const t = translations[i]
            const m = months[i]
            monthTranslations.set(m,t)
        }
    }

    function correctData(){
        setupMonthTranslations()
        sixifyOrderId()
        translateStatus()
        parseCreationTime()
    }

    return {correctData,cdate,cstatus,cid,orderItemCorrespondingClassName}
}