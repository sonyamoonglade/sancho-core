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
