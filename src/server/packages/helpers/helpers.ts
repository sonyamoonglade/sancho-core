import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

//todo: tests
export const helpers = {
   mapDateToUTC: function (date: Date): Date {
      //get dayjs obj from UTC'd date and select it at UTC timezone
      return dayjs.tz(dayjs(date.toUTCString()), "UTC").toDate();
   },

   selectNowUTC: function (): Date {
      //get now()
      const d = dayjs();
      //get it at UTC timezone
      const utc = dayjs.tz(d, "UTC").toDate();
      return utc;
   },
   //amount is stated in days
   subtractFrom: function (date: Date, amount: number): Date {
      const sub = dayjs(date).subtract(amount, "d");
      return this.newUTCFrom(sub);
   },

   newUTCFrom: function (date: Date): Date {
      return dayjs.tz(date, "UTC").toDate();
   },

   mapToObject: function (m: Map<any, any>): Object {
      return Object.fromEntries(Array.from(m.entries()));
   }
};
