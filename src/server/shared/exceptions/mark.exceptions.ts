import { HttpException, HttpStatus } from "@nestjs/common";

export class MarkDoesNotExist extends HttpException {
   constructor(markId: number) {
      super(`Метка с номером ${markId} не существует`, HttpStatus.BAD_REQUEST);
   }
}
export class MarkCannotBeDeleted extends HttpException {
   constructor() {
      super(`Метка постоянного клиента не может быть удалена до окончания срока действия`, HttpStatus.BAD_REQUEST);
   }
}

export class DuplicateMark extends HttpException {
   constructor(v: string) {
      super(`Ошибка создания метки. Возможно, Метка '${v}' уже существует.`, HttpStatus.CONFLICT);
   }
}
