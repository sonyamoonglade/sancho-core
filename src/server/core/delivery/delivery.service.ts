import { Injectable } from "@nestjs/common";
import { DeliveryServiceInterface } from "./delivery";
import { CreateDeliveryDto, DownloadCheckDto, RegisterRunnerDto } from "./dto/delivery.dto";
import axios, { AxiosError } from "axios";
import { ValidationErrorException } from "../../packages/exceptions/validation.exceptions";
import { PinoLogger } from "nestjs-pino";
import {
   CheckServiceUnavailable,
   DeliveryAlreadyExists,
   RunnerAlreadyExists,
   TelegramInternalError
} from "../../packages/exceptions/delivery.exceptions";
import { UnexpectedServerError } from "../../packages/exceptions/unexpected-errors.exceptions";
import { DeliveryStatus } from "../../types/types";
import { EventsService } from "../../packages/event/event.module";
import { EventEmitter } from "node:events";
import { Events } from "../../packages/event/events";

@Injectable()
export class DeliveryService implements DeliveryServiceInterface {
   private readonly url: string;
   private events: EventEmitter;

   constructor(private logger: PinoLogger, private eventsService: EventsService) {
      this.logger.setContext(DeliveryService.name);
      this.events = eventsService.GetEmitter();
      this.url = process.env.DELIVERY_SERVICE_URL + "/api";
   }

   async downloadCheck(dto: DownloadCheckDto): Promise<Buffer> {
      this.logger.info("call delivery microservice downloadCheck");
      try {
         const endPoint = "/check";
         const response = await axios.post(this.url + endPoint, dto, {
            responseType: "arraybuffer",
            responseEncoding: "utf-8"
         });
         const data = response.data;
         this.logger.debug(`received buffer with length ${data.length}`);
         return data;
      } catch (e: any) {
         const payload = {
            order_id: dto.order.order_id
         };
         this.parseDeliveryError(e, payload);
         return null;
      }
   }

   async banRunner(runnerId: number): Promise<boolean> {
      return Promise.resolve(undefined);
   }

   async createDelivery(dto: CreateDeliveryDto): Promise<boolean> {
      this.logger.info("call delivery microservice createDelivery");
      //todo: implement request id
      try {
         const endPoint = "/delivery";
         await axios.post(this.url + endPoint, dto);

         this.logger.info("call succeeded");
         this.events.emit(Events.ORDER_QUEUE_HAS_MODIFIED);
         return true;
      } catch (e: any) {
         const payload = {
            order_id: dto.order.order_id
         };
         this.parseDeliveryError(e, payload);
         this.logger.error("call failed with error");
         return false;
      }
   }

   async registerRunner(dto: RegisterRunnerDto): Promise<boolean> {
      this.logger.info("call delivery microservice registerRunner");
      try {
         const endpoint = "/runner";
         await axios.post(this.url + endpoint, dto);
         this.logger.info("call succeeded");
         return true;
      } catch (e: any) {
         const payload = {
            phoneNumber: dto.phone_number
         };
         this.parseDeliveryError(e, payload);
         this.logger.error("call failed with error");
         return false;
      }
   }

   async status(orderIds: number[]): Promise<DeliveryStatus[]> {
      this.logger.info("call delivery microservice status");
      try {
         const endPoint = "/delivery/status";
         const body = {
            order_ids: orderIds
         };
         const { data } = await axios.post(this.url + endPoint, body);
         this.logger.info("call succeeded");
         return data.result;
      } catch (e) {
         this.parseDeliveryError(e);
         this.logger.error("call failed with error");
         return [];
      }
   }

   parseDeliveryError(err: any, payload?: any): void {
      const responseData = err?.response?.data;
      let message = responseData?.message?.toLowerCase();
      if (Buffer.isBuffer(responseData)) {
         message = (responseData as Buffer).toString("utf-8").toLowerCase();
      }
      if (!message) throw new UnexpectedServerError();
      this.logger.debug(`response message: ${message}`);
      switch (true) {
         case message.includes("validation"):
            this.logger.debug("throw validation error exception");
            throw new ValidationErrorException();
         case message.includes("delivery already exists"):
            this.logger.debug("throw delivery already exists exception");
            throw new DeliveryAlreadyExists(payload?.order_id);
         case message.includes("runner already exists"):
            this.logger.debug("throw runner already exists exception");
            throw new RunnerAlreadyExists(payload?.phoneNumber);
         case message.includes("telegram"):
            this.logger.debug("throw internal telegram error exception");
            throw new TelegramInternalError();
         case message.includes("check"):
            //Means something is wrong with api keys (check service will be unavailable)
            this.logger.debug("throw check service unavailable error exception");
            throw new CheckServiceUnavailable();
         default:
            throw new UnexpectedServerError();
      }
   }
}
