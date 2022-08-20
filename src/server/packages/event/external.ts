import { EventsService } from "./event.service";
import { Events } from "./contract";

export function InitExternalCalls(logger: any, eventsService: EventsService) {
   eventsService.Subscribe(Events.ORDER_CREATED, eventsService.ExternalFireCallback(Events.ORDER_CREATED));
   logger.log(`subscribed to ${Events.ORDER_CREATED}`);
}
