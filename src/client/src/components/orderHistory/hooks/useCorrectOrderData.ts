import { useMemo, useState } from "react";
import { OrderStatus, ResponseUserOrder } from "../../../common/types";
import { DATE_FORMAT_TEMPLATE, OrderStatusTranslate } from "../../../types/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
export function useCorrectOrderData(order: ResponseUserOrder) {
   const [cid, setCid] = useState(""); // id
   const [cstatus, setCStatus] = useState(""); // status
   const [cdate, setCDate] = useState(""); // creation date
   const [cddate, setCDDate] = useState(""); // delivery date

   const orderItemCorrespondingClassName = useMemo(() => {
      return order?.status === OrderStatus.waiting_for_verification
         ? "--yellow order_h_item"
         : order.status === OrderStatus.verified
         ? "--green order_h_item"
         : order.status === OrderStatus.cancelled
         ? "--red order_h_item"
         : order.status === OrderStatus.completed
         ? "--dark-blue order_h_item"
         : "order_h_item";
   }, [order]);
   const monthTranslations = useMemo(() => {
      return new Map<string, string>();
   }, []);
   function sixifyOrderId() {
      let currentId: string[] = order?.id.toString().split("");
      for (let i = 0; i < 6; i++) {
         if (currentId.length !== 6) {
            currentId.unshift("0");
         }
      }
      setCid(currentId.join(""));
   }
   function translateStatus() {
      switch (order?.status) {
         case OrderStatus.cancelled:
            setCStatus(OrderStatusTranslate.cancelled);
            break;
         case OrderStatus.completed:
            setCStatus(OrderStatusTranslate.completed);
            break;
         case OrderStatus.verified:
            setCStatus(OrderStatusTranslate.verified);
            break;
         case OrderStatus.waiting_for_verification:
            setCStatus(OrderStatusTranslate.waiting_for_verification);
            break;
      }
   }
   function parseCreationTime(offset: number = 0) {
      const createdAt = dayjs.tz(order?.created_at, "UTC").add(offset, "hour");
      const deliveredAt = dayjs.tz(order?.delivery_details?.delivered_at, "UTC").add(offset, "hour");

      const formattedc = createdAt.format(DATE_FORMAT_TEMPLATE).split(" ");
      const formattedd = deliveredAt.format(DATE_FORMAT_TEMPLATE).split(" ");

      let indexOfMonth = 1;
      const currMonthc = formattedc[indexOfMonth];
      const currMonthd = formattedd[indexOfMonth];

      formattedc[indexOfMonth] = monthTranslations.get(currMonthc); // getting translation
      formattedd[indexOfMonth] = monthTranslations.get(currMonthd); // getting translation

      const outputc = formattedc.join(" ");
      setCDate(outputc);

      const outputd = formattedd.join(" ");
      setCDDate(outputd);
   }
   function setupMonthTranslations() {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const translations = ["Янв", "Фев", "Мар", "Апр", "май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
      for (let i = 0; i < months.length; i++) {
         const t = translations[i];
         const m = months[i];
         monthTranslations.set(m, t);
      }
   }

   function correctData() {
      setupMonthTranslations();
      sixifyOrderId();
      translateStatus();
      //TODO: DO NOT HARDCODE FIXME: !!!
      const offset = 4; //gmt offset
      parseCreationTime(offset);
   }

   return { correctData, cdate, cddate, cstatus, cid, orderItemCorrespondingClassName };
}
