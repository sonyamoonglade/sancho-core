import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter } from "node:events";
import { EventsServiceUnavailable, InvalidRequestPayload, TooMuchSubscriptions } from "../exceptions/event.exceptions";
import { Events, ExternalCaller, InternalEvents } from "./contract";
import { GetAppConfig } from "../config/config";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import { CreateSubscriptionDto } from "./dto/event.dto";
import { NotFoundError } from "rxjs";

@Injectable()
export class EventsService {
   private readonly emitter: EventEmitter;
   private readonly baseURL: string;

   constructor(private logger: PinoLogger) {
      this.emitter = new EventEmitter();
      this.baseURL = GetAppConfig().env.notificationServiceURL;
      this.logger.setContext(EventsService.name);
   }

   Fire(event: InternalEvents): void {
      this.emitter.emit(event);
      return;
   }

   FireExternal(event: Events, body: any): void {
      this.emitter.emit(event, body);
   }

   Subscribe(event: string, callback: any): void {
      const ln = this.emitter.listeners(event).length;
      if (ln > 0) {
         throw new TooMuchSubscriptions(event);
      }
      this.emitter.on(event, callback);
      return;
   }

   ExternalFireCallback(event: Events): ExternalCaller {
      return async (body: any) => {
         try {
            const endPoint = this.baseURL + `/api/events/fire/${event}`;
            await axios.post(endPoint, body);
            this.logger.debug(`event ${event} has fired`);
            return;
         } catch (e: any) {
            this.logger.error(`error firing event ${event}. ${e?.response?.data}`);
            return;
         }
      };
   }

   async CreateSubscriptionAPI(dto: CreateSubscriptionDto): Promise<void> {
      try {
         const endPoint = this.baseURL + `/api/subscriptions`;
         await axios.post(endPoint, dto);
         return;
      } catch (e) {
         this.logger.error(`create subscription failed with error. ${e}`);
         this.parseEventServiceError(e);
         throw e;
      }
   }

   async CancelSubscriptionAPI(subscriptionId: number): Promise<void> {
      try {
         const endPoint = this.baseURL + `/api/subscriptions/${subscriptionId}`;
         await axios.delete(endPoint);
         return;
      } catch (e) {
         this.logger.error(`cancel subscription failed with error ${e}`);
         this.parseEventServiceError(e);
         throw e;
      }
   }

   parseEventServiceError(e: any) {
      const message = e?.response?.data || "";
      this.logger.error(`error message: ${message}`);
      switch (true) {
         case message?.includes("invalid request payload"):
            throw new InvalidRequestPayload();
         case message?.includes("does not exist"):
            throw new NotFoundException();
         default:
            throw new EventsServiceUnavailable();
      }
   }
}
