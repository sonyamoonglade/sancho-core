import { Injectable } from "@nestjs/common";
import { Response } from "express";

import * as dayjs from "dayjs";
import { CookieNames } from "../../types/types";

@Injectable()
export class CookieService {
   constructor() {}

   setCanCancelCookie(res: Response, ttl: number): Response {
      const now = dayjs();
      const afterTtl = now.add(ttl, "minutes").toDate();
      res.cookie(CookieNames.cancelBan, false, {
         httpOnly: true,
         secure: false,
         expires: afterTtl,
         sameSite: "strict"
      });
      return res;
   }

   setUserSessCookie(res: Response, SID: string): Response {
      res.cookie(CookieNames.SID, SID, {
         httpOnly: true,
         secure: false,
         sameSite: "strict",
         path: "/"
      });
      return res;
   }

   setMasterSessCookie(res: Response, SID: string): Response {
      const now = dayjs();
      const ttl = now.add(1, "day").toDate(); //24h

      res.cookie(CookieNames.SID, SID, {
         httpOnly: true,
         secure: false,
         sameSite: "strict",
         path: "/",
         expires: ttl
      });
      return res;
   }

   public clearSessCookie(res: Response): void {
      res.clearCookie(CookieNames.SID, {
         httpOnly: true,
         secure: false,
         sameSite: "strict",
         path: "/"
      });
   }
}
