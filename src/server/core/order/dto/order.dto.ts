import { OrderStatus } from "../../../../common/types";

export class LastVerifiedOrderDto {
   created_at: Date;
   id: number;
   status: OrderStatus;
}
