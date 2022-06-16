import {Injectable} from "@nestjs/common";
import {Session} from "../entities/Session";
import * as dayjs from "dayjs";
import {SessionRepository} from "./session.repository";
import {Response} from "express";
import SimpleCrypto from "simple-crypto-js";
import {CookieNames} from "../../types/types";
import {UnexpectedServerError} from "../../shared/exceptions/unexpected-errors.exceptions";

require('dotenv').config()

const scrypto = require("simple-crypto-js").default

@Injectable()
export class SessionService {


  private SECRET = process.env.HASH_SECRET;

  private crypt:SimpleCrypto



  constructor(private sessionRepository: SessionRepository) {
    this.crypt = new scrypto(this.SECRET);
  }


  async createSession(user_id:number): Promise<string> {
    const currentTime = dayjs();
    const sessionIdBase = currentTime.unix().toString();

    try {

      const encryptedSID = this.crypt.encrypt(sessionIdBase)

      const newSession: Session = {
        user_id,
        session_id: encryptedSID
      };

      await this.sessionRepository.save(newSession);

      return encryptedSID;

    } catch (e) {
      throw new UnexpectedServerError();
    }

  }
  attachCookieToResponse(res: Response, SID: string): Response {
    res.cookie(CookieNames.SID, SID, {
      httpOnly: true,
      secure: true,
      sameSite:'none',
      // signed: true,
      path: '/'
    });
    return res

  }
  async deAttachCookieFromResponse(res: Response, SID: string): Promise<void> {
    res.clearCookie(CookieNames.SID);
    await this.destroySession(SID);
  }
  async destroySession(SID: string): Promise<void> {
    await this.sessionRepository.delete(SID);
  }
  async getSIDByUserId(user_id:number):Promise<string>{
    try {
      const session = (await this.sessionRepository.get({where:{user_id}}))
      return session[0].session_id
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }
  async getUserIdBySID(SID: string) :Promise<number | undefined>{
    const session:Session = (await this.sessionRepository.get({where:{session_id:SID}}))[0]
    return session.user_id
  }

}

