import { HttpException, HttpStatus } from "@nestjs/common";

export class MarkDoesNotExist extends HttpException {
   constructor(markId: number, userId: number) {
      super(`Метка с номером ${markId} не существует у пользователя с номером ${userId}`, HttpStatus.BAD_REQUEST);
   }
}
