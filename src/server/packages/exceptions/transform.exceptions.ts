import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidDateFormat extends HttpException {
   constructor() {
      super("Некорректный формат даты", HttpStatus.BAD_REQUEST);
   }
}

export class InvalidAggregationPreset extends HttpException {
   constructor(preset: string) {
      super(`Преднастройки ${preset} не существует`, HttpStatus.BAD_REQUEST);
   }
}
