import { Injectable } from "@nestjs/common";
import { DeliveryServiceInterface } from "./delivery";
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";
import axios from "axios";

@Injectable()
export class DeliveryService implements DeliveryServiceInterface {
   private readonly url: string;
   constructor() {
      this.url = process.env.DELIVERY_SERVICE_URL + "/api";
   }

   async banRunner(runnerId: number): Promise<void> {
      return Promise.resolve(undefined);
   }

   async createDelivery(dto: CreateDeliveryDto): Promise<void> {
      //todo: implement request id
      try {
         const endPoint = "/delivery";
         const response = await axios.post(this.url + endPoint, dto);
         console.log(response);
         return;
      } catch (e) {
         console.log(e);
         return;
      }
   }

   async registerRunner(dto: RegisterRunnerDto): Promise<void> {
      return Promise.resolve(undefined);
   }
}
