import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationErrorException extends HttpException {
   constructor() {
      super("Validation Error", HttpStatus.BAD_REQUEST);
   }
}
