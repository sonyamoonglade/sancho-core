import { HttpException, HttpStatus } from "@nestjs/common";

export class TooMuchSubscriptions extends Error {
   constructor(eventName: string) {
      super(`too much subscriptions for event ${eventName}`);
   }
}

export class EventsServiceUnavailable extends HttpException {
   constructor() {
      super(`Сервис нотификаций недоступен`, HttpStatus.SERVICE_UNAVAILABLE);
   }
}

export class InvalidRequestPayload extends HttpException {
   constructor() {
      super(`Неверный формат данных`, HttpStatus.BAD_REQUEST);
   }
}
