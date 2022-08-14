import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { Session } from "../../entities/Session";
import { SessionService } from "../session.service";
import { SessionRepository } from "../session.repository";
import { CookieNames, extendedRequest } from "../../../types/types";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
   constructor(private sessionService: SessionService, private sessionRepository: SessionRepository, private logger: PinoLogger) {}

   async use(req: extendedRequest, res: Response, next: (error?: any) => void): Promise<any> {
      this.logger.debug("session middleware");
      const SID = req.cookies[CookieNames.SID];
      try {
         if (SID == undefined) {
            this.logger.debug("unauthorized undf");
            return res.status(401).end();
         }
         const session: Session = await this.sessionRepository.getById(SID);
         if (session) {
            const { user_id } = session;
            req.user_id = user_id;
            this.logger.debug("ok");
            return next();
         } else {
            this.logger.debug("unauthorized nosess");
            return res.status(401).end();
         }
      } catch (e) {
         this.logger.error(e);
         return res.status(401).end();
      }
   }
}
