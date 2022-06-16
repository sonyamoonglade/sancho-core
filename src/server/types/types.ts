import {Request} from "express";



export enum CookieNames {
    SID = "SID",
    cancelBan = "cancel_ban"
}




export interface extendedRequest extends Request{
    user_id: number
}