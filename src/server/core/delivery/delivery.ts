//Introduce interface for http communication with delivery microservice api
import { CreateDeliveryDto, RegisterRunnerDto } from "./dto/delivery.dto";

export interface DeliveryServiceInterface {
   createDelivery(dto: CreateDeliveryDto): Promise<boolean>;
   registerRunner(dto: RegisterRunnerDto): Promise<boolean>;
   banRunner(runnerId: number): Promise<boolean>;
}
