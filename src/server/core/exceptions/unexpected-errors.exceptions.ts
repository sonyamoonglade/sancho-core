import {HttpException, HttpStatus} from "@nestjs/common";


export class UnexpectedServerError extends HttpException{

  constructor(msg?:string) {
    super(`unexpected server error ${msg != undefined? msg : ""}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}