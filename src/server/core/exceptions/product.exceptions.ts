import {HttpException, HttpStatus} from "@nestjs/common";

export class ProductAlreadyExistsException extends HttpException{
  constructor(name: string) {
    super(`Продукт с именем: ${name} уже существует!`, HttpStatus.BAD_REQUEST);
  }
}

export class ProductDoesNotExistException extends HttpException{
  constructor(id: number) {
    super(`Продукт с айди ${id} не существует!`,HttpStatus.BAD_REQUEST);
  }
}