import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidQuery extends HttpException {
   constructor() {
      super("Некоректные параметры запроса", HttpStatus.BAD_REQUEST);
   }
}
