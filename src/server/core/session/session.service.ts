import { Injectable } from "@nestjs/common";
import { Session } from "../entities/Session";
import * as dayjs from "dayjs";
import { SessionRepository } from "./session.repository";
import { Response } from "express";
import { CookieNames } from "../../types/types";
import { UnexpectedServerError } from "../../packages/exceptions/unexpected-errors.exceptions";
import * as crypto from "crypto";
import { GetAppConfig } from "../../packages/config/config";

@Injectable()
export class SessionService {
   private readonly SECRET: string;

   constructor(private sessionRepository: SessionRepository) {
      this.SECRET = GetAppConfig().env.hashSecret;
   }

   async generateSession(userId: number): Promise<string> {
      const currentTime = dayjs();
      const payload = currentTime.unix().toString() + userId + this.SECRET;
      const h = crypto.createHash("sha256").update(payload).digest("hex");
      try {
         const newSession: Session = {
            user_id: userId,
            session_id: h
         };

         await this.sessionRepository.save(newSession);

         return h;
      } catch (e) {
         throw new UnexpectedServerError();
      }
   }
   async generateMasterSession(masterId: number): Promise<string> {
      const currentTime = dayjs();
      const payload = currentTime.unix().toString() + masterId + this.SECRET;
      const h = crypto.createHash("sha256").update(payload).digest("hex");

      await this.sessionRepository.destroyAndGenerate(h, masterId);

      return h;
   }
   public clearSession(res: Response): void {
      res.clearCookie(CookieNames.SID, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         path: "/"
      });
   }
   public putUserSession(res: Response, SID: string): Response {
      res.cookie(CookieNames.SID, SID, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         path: "/"
      });
      return res;
   }
   public putMasterSession(res: Response, SID: string): Response {
      const now = dayjs();
      const ttl = now.add(1, "day").toDate(); //24h

      res.cookie(CookieNames.SID, SID, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         path: "/",
         expires: ttl
      });
      return res;
   }
   async destroySession(SID: string): Promise<void> {
      return this.sessionRepository.destroy(SID);
   }
   async getSIDByUserId(user_id: number): Promise<string> {
      try {
         const session = await this.sessionRepository.get({
            where: { user_id }
         });
         return session[0]?.session_id;
      } catch (e) {
         throw new UnexpectedServerError();
      }
   }
   async getUserIdBySID(SID: string): Promise<number | undefined> {
      const session: Session = (await this.sessionRepository.get({ where: { session_id: SID } }))[0];
      return session?.user_id;
   }
}
