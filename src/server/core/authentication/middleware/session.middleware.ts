import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { Session } from "../../entities/Session";
import { SessionService } from "../session.service";
import { SessionRepository } from "../session.repository";
import { CookieNames, extendedRequest } from "../../../types/types";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
   constructor(private sessionService: SessionService, private sessionRepository: SessionRepository) {}

   async use(req: extendedRequest, res: Response, next: (error?: any) => void): Promise<any> {
      const SID = req.cookies[CookieNames.SID];
      try {
         if (SID == undefined) return res.status(401).end();
         const session: Session = await this.sessionRepository.getById(SID);
         if (session) {
            const { user_id } = session;
            req.user_id = user_id;
            return next();
         } else {
            return res.status(401).end();
         }
      } catch (e) {
         return res.status(401).end();
      }

      next();
   }
}
