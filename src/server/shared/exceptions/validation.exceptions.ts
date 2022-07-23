import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationErrorException extends HttpException {
   constructor() {
      super("Validation error. Не корректные поля запроса", HttpStatus.BAD_REQUEST);
   }
}
