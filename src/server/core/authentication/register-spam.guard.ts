import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Request} from "express";
import {CookieNames} from "../../types/types";


@Injectable()
export class RegisterSpamGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {

    const req:Request = context.switchToHttp().getRequest()

    const SID = req.cookies[CookieNames.SID]

    if(SID == undefined) { return true }

    return false

  }
}