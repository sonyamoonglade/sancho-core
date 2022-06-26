import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderCreationLimitExceeded extends HttpException {
   constructor(remainingTime: number) {
      super(`Пожалуйста, подождите ${remainingTime} минут(ы) для создания нового заказа или проследуйте инструкции`, HttpStatus.BAD_REQUEST);
   }
}
export class CancelExplanationHasNotBeenProvided extends HttpException {
   constructor() {
      super("Причина отмены заказа не была указана. Пожалуйста, укажите", HttpStatus.BAD_REQUEST);
   }
}
export class LastOrderIsNotYetVerified extends HttpException {
   constructor(extraMsg?: string) {
      super(
         `${extraMsg !== undefined ? extraMsg : ""}Ваш последний заказ еще не подтвежден. Дождитесь подтверждения или отмените заказ!`,
         HttpStatus.FORBIDDEN
      );
   }
}

export class OrderCannotBeVerified extends HttpException {
   constructor(phone_number: string) {
      super(`Все заказы по номеру ${phone_number} подтверждены!`, HttpStatus.BAD_REQUEST);
   }
}

export class OrderCannotBeCompleted extends HttpException {
   constructor(orderId: number) {
      super(`Статус заказа - ${orderId} НЕ подтвержден!`, HttpStatus.BAD_REQUEST);
   }
}

export class InvalidOrderStatus extends HttpException {
   constructor(type: string) {
      super(`Тип ${type} не существует`, HttpStatus.BAD_REQUEST);
   }
}
