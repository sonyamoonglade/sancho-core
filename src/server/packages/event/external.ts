import { EventsService } from "./event.service";
import { Events } from "./contract";

export function InitExternalSubscriptions(logger: any, eventsService: EventsService) {
   Object.values(Events).forEach((event) => {
      eventsService.Subscribe(event, eventsService.ExternalFireCallback(event));
      logger.log(`subscribed to ${event}`);
   });
}
