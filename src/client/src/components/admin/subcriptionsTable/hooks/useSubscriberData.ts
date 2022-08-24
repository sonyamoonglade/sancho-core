import { useState } from "react";
import { SubscriberRO, SubscriberWithoutSubscriptionsRO } from "../../../../types/types";
import { ExternalEvent } from "../../../../common/types";
import { useAdminApi } from "../../../../hooks/useAdminApi";
import { SubscribeDto } from "../SubscriptionsTable";

export function useSubscriberData(isProcessing: boolean, setIsProcessing: Function) {
   //It stores subscribers WITH subscriptions ( if 0 subscriptions present - subscriber is removed from response but required on client side )
   const [subscribers, setSubscribers] = useState<SubscriberRO[]>([]);
   //That's why we need another state to store all subscribers no matter of what
   const [allSubscribers, setAllSubscribers] = useState<SubscriberWithoutSubscriptionsRO[]>([]);
   const [evs, setEvs] = useState<ExternalEvent[]>([]);
   const { fetchSubscriberJoinedData, fetchAvailableEvents, subscribe, unsubscribe, fetchAllSubscribers } = useAdminApi();

   async function fetchAllSubscribersAsync() {
      const allSubscribers = await fetchAllSubscribers();
      setAllSubscribers(allSubscribers);
   }

   async function fetchAvailableEventsAsync() {
      const events = await fetchAvailableEvents();
      setEvs(events);
   }

   async function fetchSubscriberDataAsync() {
      const subs = await fetchSubscriberJoinedData();
      setSubscribers(subs);
   }

   function handleCheck(ename: string, subPhoneNumber: string) {
      const body: SubscribeDto = {
         phone_number: subPhoneNumber,
         event_name: ename
      };

      return async function (checked: boolean) {
         setIsProcessing(true);
         if (checked) {
            const subscriptionId = findSubscriptionId(ename, subPhoneNumber);
            if (subscriptionId === 0) {
               return;
            }

            //Cancel subscription by subscriptionId
            await unsubscribe(subscriptionId);

            //Refetch
            await fetchSubscriberDataAsync();
            setIsProcessing(false);
            return;
         }

         //Subscribe to event
         await subscribe(body);

         //Refetch
         await fetchSubscriberDataAsync();
         setIsProcessing(false);
         return;
      };
   }

   function isActive(sub: SubscriberWithoutSubscriptionsRO, e: ExternalEvent): boolean {
      //Find according subscriber with subscriptions in subscriber's list
      const subWithSubscription = subscribers?.find((s) => s.phone_number === sub.phone_number);
      //Return whether in at most one subscription with same event as passed as argument is present
      return subWithSubscription?.subscriptions?.some((sub) => sub.event.name === e.name);
   }

   //Find subscriptionId in subscribers by phoneNumber and event name
   function findSubscriptionId(ename: string, subPhoneNumber: string): number {
      const subscriber = subscribers.find((sub) => sub.phone_number === subPhoneNumber);
      return subscriber?.subscriptions?.find((subs) => subs.event.name === ename).subscription_id || 0;
   }

   function clearState() {
      setSubscribers([]);
      setEvs([]);
      setAllSubscribers([]);
   }

   return {
      allSubscribers,
      subscribers,
      evs,
      fetchAllSubscribersAsync,
      fetchAvailableEventsAsync,
      fetchSubscriberDataAsync,
      isActive,
      clearState,
      handleCheck
   };
}
