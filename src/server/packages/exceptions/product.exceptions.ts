import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductAlreadyExistsException extends HttpException {
   constructor(name: string) {
      super(`Продукт с именем: ${name} уже существует!`, HttpStatus.BAD_REQUEST);
   }
}
export class ProductDoesNotExistException extends HttpException {
   constructor(id: number) {
      super(`Продукт с номером ${id} не существует!`, HttpStatus.BAD_REQUEST);
   }
}

export class InvalidCategoryException extends HttpException {
   constructor(category: string) {
      super(`Категория ${category} не существует.`, HttpStatus.BAD_REQUEST);
   }
}

export class ProductCantBeApproved extends HttpException {
   constructor(productId: number) {
      super(`Продукт с номером ${productId} не существует`, HttpStatus.NOT_FOUND);
   }
}

export class CategoryAlreadyExists extends HttpException {
   constructor(name: string) {
      super(`Категория ${name} уже существует.`, HttpStatus.CONFLICT);
   }
}

export class CategoryDoesNotExist extends HttpException {
   constructor(name: string) {
      super(`Категория ${name} не существует.`, HttpStatus.BAD_REQUEST);
   }
}

export class CategoryHasTopRank extends HttpException {
   constructor(name: string) {
      super(`Категория ${name} на 1 месте, ошибка поднятия rank`, HttpStatus.BAD_REQUEST);
   }
}

export class CategoryIsNotEmpty extends HttpException {
   constructor(name: string, count: number) {
      super(`Категория ${name} не пустая. Для начала, удалите ${count} товаров(ов).`, HttpStatus.BAD_REQUEST);
   }
}
