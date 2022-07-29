import { HttpException, HttpStatus } from "@nestjs/common";

export class FileUploadErrorException extends HttpException {
   constructor(fileName: string, productId: number) {
      super(`Файл с именем ${fileName} к продукту ${productId} не был добавлен в систему. Возникла ошибка`, HttpStatus.INTERNAL_SERVER_ERROR);
   }
}

export class FileDoesNotExist extends HttpException {
   constructor(fileName: string) {
      super(`Файл с именем ${fileName} не существует`, HttpStatus.BAD_REQUEST);
   }
}
