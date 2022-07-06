import { HttpException, HttpStatus } from "@nestjs/common";

export class MarkDoesNotExist extends HttpException {
   constructor(markId: number) {
      super(`Метка с номером ${markId} не существует`, HttpStatus.BAD_REQUEST);
   }
}
