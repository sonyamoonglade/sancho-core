import { Injectable } from "@nestjs/common";
import { DeliveryServiceInterface } from "./delivery";
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";
import axios, { AxiosError } from "axios";
import { ValidationErrorException } from "../../shared/exceptions/validation.exceptions";
import { PinoLogger } from "nestjs-pino";
import { DeliveryAlreadyExists, RunnerAlreadyExists, TelegramInternalError } from "../../shared/exceptions/delivery.exceptions";
import { UnexpectedServerError } from "../../shared/exceptions/unexpected-errors.exceptions";

@Injectable()
export class DeliveryService implements DeliveryServiceInterface {
   private readonly url: string;
   constructor(private logger: PinoLogger) {
      this.logger.setContext(DeliveryService.name);
      this.url = process.env.DELIVERY_SERVICE_URL + "/api";
   }

   async banRunner(runnerId: number): Promise<boolean> {
      return Promise.resolve(undefined);
   }

   async createDelivery(dto: CreateDeliveryDto): Promise<boolean> {
      this.logger.info("call delivery microservice");
      //todo: implement request id
      try {
         const endPoint = "/delivery";
         await axios.post(this.url + endPoint, dto);

         this.logger.info("call succeeded");
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
      this.logger.info("call delivery microservice");
      try {
         const endpoint = "/runner";
         await axios.post(this.url + endpoint, dto);
         this.logger.info("call succeeded");
         console.log("runner creds: ", dto);
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

   parseDeliveryError(err: AxiosError, payload?: any): void {
      const responseData = err.response.data;
      const message = responseData?.message?.toLowerCase();
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
         default:
            throw new UnexpectedServerError();
      }
   }
}
