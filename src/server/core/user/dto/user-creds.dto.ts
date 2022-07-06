import { DeliveryDetails } from "../../../../common/types";
import { Mark } from "../../entities/Mark";

export class UserCredentialsDto {
   username: string;
   userDeliveryAddress: DeliveryDetails;
   marks: Mark[];
}
