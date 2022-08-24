import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter } from "node:events";
import { EventsServiceUnavailable, InvalidRequestPayload, TooMuchSubscriptions } from "../exceptions/event.exceptions";
import { Events, ExternalCaller, InternalEvents } from "./contract";
import { GetAppConfig } from "../config/config";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import { CreateSubscriptionDto, RegisterSubscriberDto } from "./dto/event.dto";
import { NotFoundError } from "rxjs";
import { SubscriberRO } from "./responseObject/event.response-object";
import { AvailableEventsResponse, SubscribersJoinedDataResponse, SubscribersWithoutSubscriptionsResponse } from "./external";
import { ExternalEvent } from "../../../common/types";

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
            //ignore error
            return;
         }
      };
   }

   async createSubscriptionAPI(dto: CreateSubscriptionDto): Promise<void> {
      try {
         const endPoint = this.baseURL + `/api/subscriptions`;
         await axios.post(endPoint, dto);
         return;
      } catch (e) {
         this.logger.error(`create subscription failed with error. ${e}`);
         this.parseEventServiceError(e);
      }
   }

   async cancelSubscriptionAPI(subscriptionId: number): Promise<void> {
      try {
         const endPoint = this.baseURL + `/api/subscriptions/${subscriptionId}`;
         await axios.delete(endPoint);
         return;
      } catch (e) {
         this.logger.error(`cancel subscription failed with error ${e}`);
         this.parseEventServiceError(e);
      }
   }

   async getSubscribersJoinedData(): Promise<SubscribersJoinedDataResponse> {
      try {
         const endPoint = this.baseURL + "/api/subscriptions/subscribers/joined";
         const { data } = await axios.get<SubscribersJoinedDataResponse>(endPoint);
         return data;
      } catch (e) {
         this.logger.error(`get joined data failed with error ${e}`);
         this.parseEventServiceError(e);
      }
   }

   async getAllSubscribersWithoutSubscriptions(): Promise<SubscribersWithoutSubscriptionsResponse> {
      try {
         const endPoint = this.baseURL + "/api/subscriptions/subscribers";
         const { data } = await axios.get<SubscribersWithoutSubscriptionsResponse>(endPoint);
         return data;
      } catch (e) {
         this.logger.error(`get joined data failed with error ${e}`);
         this.parseEventServiceError(e);
      }
   }

   async getAvailableEventsAPI(): Promise<AvailableEventsResponse> {
      try {
         const endPoint = this.baseURL + "/api/events";
         const { data } = await axios.get<AvailableEventsResponse>(endPoint);
         return data;
      } catch (e) {
         this.logger.error(`get all evens failed with error ${e}`);
         this.parseEventServiceError(e);
      }
   }

   async registerSubscriberAPI(dto: RegisterSubscriberDto): Promise<void> {
      try {
         const endPoint = this.baseURL + "/api/subscriptions/subscribers";
         await axios.post(endPoint, dto);
         return;
      } catch (e) {
         this.logger.error(`register subscriber failed with error ${e}`);
         this.parseEventServiceError(e);
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
