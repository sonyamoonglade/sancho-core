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
         secure: true,
         expires: afterTtl,
         sameSite: "none"
      });
      return res;
   }
}
