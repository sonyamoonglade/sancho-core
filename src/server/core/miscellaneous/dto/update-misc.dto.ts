import { IsDefined, IsNumber } from "class-validator";

export class UpdateMiscDto {
   delivery_punishment_threshold: number;
   order_creation_delay: number;
   delivery_punishment_value: number;
}
