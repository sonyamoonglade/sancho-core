//Introduce interface for http communication with delivery microservice api
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";
import { DeliveryStatus } from "../../types/types";

export interface DeliveryServiceInterface {
   createDelivery(dto: CreateDeliveryDto): Promise<boolean>;
   registerRunner(dto: RegisterRunnerDto): Promise<boolean>;
   banRunner(runnerId: number): Promise<boolean>;
   status(orderIds: number[]): Promise<DeliveryStatus[]>;
}
