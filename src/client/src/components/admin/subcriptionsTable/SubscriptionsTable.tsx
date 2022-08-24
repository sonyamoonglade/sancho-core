import React, { useEffect, useState } from "react";
import "./sub-table.styles.scss";
import IosToggle from "../../ui/admin/iosToggle/IosToggle";
import { SubscriberRO, SubscriberWithoutSubscriptionsRO } from "../../../types/types";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { ExternalEvent } from "../../../common/types";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useSubscriberData } from "./hooks/useSubscriberData";
import { useAppDispatch, windowActions } from "../../../redux";
import { useEvents } from "../../../hooks/useEvents";
import { Events } from "../../../events/Events";

export type SubscribeHandler = (checked: boolean) => void;

export type SubscribeDto = {
   phone_number: string;
   event_name: string;
};

const SubscriptionsTable = () => {
   const [isProcessing, setIsProcessing] = useState<boolean>(false);
   const events = useEvents();
   const {
      allSubscribers,
      fetchAllSubscribersAsync,
      fetchAvailableEventsAsync,
      fetchSubscriberDataAsync,
      evs,
      isActive,
      clearState,
      handleCheck
   } = useSubscriberData(isProcessing, setIsProcessing);

   const dispatch = useAppDispatch();

   useEffect(() => {
      setIsProcessing(true);
      fetchAvailableEventsAsync();
      fetchSubscriberDataAsync();
      fetchAllSubscribersAsync();
      events.on(Events.REFETCH_SUBSCRIBERS, fetchAllSubscribersAsync);
      setIsProcessing(false);
      return () => {
         setIsProcessing(false);
         clearState();
         events.removeAllListeners(Events.REFETCH_SUBSCRIBERS);
      };
   }, []);

   function toggleCreateSubscriber() {
      dispatch(windowActions.toggleCreateSubscriber(true));
   }

   return (
      <div className="subscriptions_table">
         <div className="new_subscription" onClick={toggleCreateSubscriber}>
            <p>Добавить новую подписку</p>
            <MdOutlineNotificationsActive size={40} />
         </div>
         {allSubscribers?.map((sub) => (
            <div className="table_content" key={sub.phone_number}>
               <div className={sub.has_telegram_subscription ? "left_col table_col" : "left_col table_col"}>
                  <p>Подписчик {sub.phone_number}</p>
                  <p>
                     Может получать уведомления в телеграм: <strong> {sub.has_telegram_subscription ? "да" : "нет"}</strong>
                  </p>
               </div>
               <div className={isProcessing ? "right_col table_col --table-processing" : "right_col table_col"}>
                  {evs?.map((e) => (
                     <div key={e.event_id} className="event_toggle">
                        <p>{e.translate}</p>
                        <IosToggle checked={isActive(sub, e)} handler={handleCheck(e.name, sub.phone_number)} />
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
};

export default SubscriptionsTable;
