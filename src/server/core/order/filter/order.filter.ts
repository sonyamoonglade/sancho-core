import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { PayPolicyException } from "../../../packages/pay/policy";
import { Response } from "express";

@Catch()
export class PolicyFilter extends BaseExceptionFilter {
   catch(exception: any, host: ArgumentsHost): any {
      if (exception instanceof PayPolicyException) {
         const res = host.switchToHttp().getResponse<Response>();
         const code = 400;
         const msg = "Условия оплаты не соблюдены.";
         res.status(code).json({
            statusCode: code,
            message: msg
         });
      } else {
         super.catch(exception, host);
      }
   }
}
