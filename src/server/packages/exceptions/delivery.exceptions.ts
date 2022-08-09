import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryAlreadyExists extends HttpException {
   constructor(orderId: number) {
      super(`Доставка заказа ${orderId} уже зарегистрирована`, HttpStatus.CONFLICT);
   }
}

export class TelegramInternalError extends HttpException {
   constructor() {
      super("Внутренняя ошибка сервиса Telegram. Сервис временно недоступен. Повторите попытку позже", HttpStatus.EXPECTATION_FAILED);
   }
}

export class RunnerAlreadyExists extends HttpException {
   constructor(phoneNumber: string) {
      super(`Курьер с телефоном ${phoneNumber} уже существует!`, HttpStatus.CONFLICT);
   }
}

export class CheckServiceUnavailable extends HttpException {
   constructor() {
      super(`Сервис чеков недоступен. Повторите попытку через 30 секунд`, HttpStatus.SERVICE_UNAVAILABLE);
   }
}

export class DeliveryServiceUnavailable extends HttpException {
   constructor() {
      super("Севрис доставок не доступен.", HttpStatus.SERVICE_UNAVAILABLE);
   }
}
