import {HttpException, HttpStatus} from "@nestjs/common";

export class UserDoesNotExistException extends HttpException{

  constructor(id: number) {
    super(`user with id ${id} does not exist`,HttpStatus.BAD_REQUEST);
  }
}


export class InvalidPasswordException extends HttpException{
  constructor() {
    super('invalid password', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidRoleException extends HttpException{
  constructor(role:string) {
    super(`Роль с названием ${role} не существует.`, HttpStatus.BAD_REQUEST);
  }
}

export class PhoneIsAlreadyTakenException extends HttpException{
  constructor(phone_number:string) {
    super(`Номер телефона ${phone_number} уже занят!`,HttpStatus.BAD_REQUEST);
  }
}

export class PasswordIsTooShortException extends HttpException {
  constructor() {
    super(`минимальная длина пароля - 8`, HttpStatus.BAD_REQUEST);
  }
}
