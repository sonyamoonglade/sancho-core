//Introduce interface for http communication with delivery microservice api
import { CreateDeliveryDto, DownloadCheckDto, RegisterRunnerDto } from "./dto/delivery.dto";
import { DeliveryStatus } from "../../types/types";
import { RunnerUser } from "../../../common/types";

export interface DeliveryServiceInterface {
   createDelivery(dto: CreateDeliveryDto): Promise<void>;
   registerRunner(dto: RegisterRunnerDto): Promise<boolean>;
   getRunners(): Promise<RunnerUser[]>;
   banRunner(runnerId: number): Promise<boolean>;
   status(orderIds: number[]): Promise<DeliveryStatus[]>;
   downloadCheck(dto: DownloadCheckDto): Promise<Buffer>;
}

export interface GetRunnersResponse {
   runners: RunnerUser[];
}
