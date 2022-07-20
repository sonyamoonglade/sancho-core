//Introduce interface for http communication with delivery microservice api
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";

export interface DeliveryServiceInterface {
   createDelivery(dto: CreateDeliveryDto): Promise<void>;
   registerRunner(dto: RegisterRunnerDto): Promise<void>;
   banRunner(runnerId: number): Promise<void>;
}
