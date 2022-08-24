import { EventsService } from "./event.service";
import { Events } from "./contract";
import { SubscriberRO, SubscriberWithoutSubscriptionsRO } from "./responseObject/event.response-object";
import { ExternalEvent } from "../../../common/types";

export function InitExternalSubscriptions(logger: any, eventsService: EventsService) {
   Object.values(Events).forEach((event) => {
      eventsService.Subscribe(event, eventsService.ExternalFireCallback(event));
      logger.log(`subscribed to ${event}`);
   });
}

export type SubscribersJoinedDataResponse = {
   subscribers: SubscriberRO[];
};

export type AvailableEventsResponse = {
   events: ExternalEvent[];
};

export type SubscribersWithoutSubscriptionsResponse = {
   subscribers: SubscriberWithoutSubscriptionsRO[];
};
