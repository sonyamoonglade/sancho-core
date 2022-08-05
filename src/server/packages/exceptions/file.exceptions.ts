import { HttpException, HttpStatus } from "@nestjs/common";

export class FileUploadErrorException extends HttpException {
   constructor(fileName: string, productId: number) {
      super(`Файл с именем ${fileName} к продукту ${productId} не был добавлен в систему. Возникла ошибка`, HttpStatus.INTERNAL_SERVER_ERROR);
   }
}

export class InvalidFileExtension extends HttpException {
   constructor(mime: string) {
      super(`Некорректный формат файла ${mime}.`, HttpStatus.BAD_REQUEST);
   }
}
