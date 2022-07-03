import { HttpException, HttpStatus } from "@nestjs/common";
import * as https from "https";

export class ProductAlreadyExistsException extends HttpException {
   constructor(name: string) {
      super(`Продукт с именем: ${name} уже существует!`, HttpStatus.BAD_REQUEST);
   }
}

export class ProductDoesNotExistException extends HttpException {
   constructor(id: number) {
      super(`Продукт с айди ${id} не существует!`, HttpStatus.BAD_REQUEST);
   }
}

export class InvalidCategoryException extends HttpException {
   constructor(category: string) {
      super(`Категория- ${category} не существует.`, HttpStatus.BAD_REQUEST);
   }
}

export class ProductCantBeApproved extends HttpException {
   constructor(productId: number) {
      super(`Товар с номером ${productId} не существует`, HttpStatus.NOT_FOUND);
   }
}
