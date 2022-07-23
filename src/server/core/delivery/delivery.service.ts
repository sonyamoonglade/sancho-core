import { Injectable } from "@nestjs/common";
import { DeliveryServiceInterface } from "./delivery";
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";
import axios from "axios";
import { ValidationErrorException } from "../../shared/exceptions/validation.exceptions";
import { PinoLogger } from "nestjs-pino";
import { DeliveryAlreadyExists, TelegramInternalError } from "../../shared/exceptions/delivery.exceptions";

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
         const response = await axios.post(this.url + endPoint, dto);
         console.log(response);
         this.logger.info("call succeeded");
         return true;
      } catch (e) {
         this.logger.error(e);
         const responseData = e.response.data;
         const message = responseData?.message;
         this.logger.debug(`response message: ${message}`);
         if (message.toLowerCase().includes("validation")) {
            this.logger.error("throw validation error exception");
            throw new ValidationErrorException();
         } else if (message.toLowerCase().includes("exists")) {
            this.logger.error("throw delivery already exists exception");
            throw new DeliveryAlreadyExists(dto.order.order_id);
         } else if (message.toLowerCase().includes("telegram")) {
            this.logger.error("throw internal telegram error exception" + "");
            throw new TelegramInternalError();
         }
         this.logger.debug("call failed with error");
         return false;
      }
   }

   async registerRunner(dto: RegisterRunnerDto): Promise<boolean> {
      return Promise.resolve(undefined);
   }
}
