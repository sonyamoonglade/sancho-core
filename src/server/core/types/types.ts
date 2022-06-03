import {Request} from "express";

export interface getUserParamsInterface{
  phone_number: string
}

export interface extendedRequest extends Request{
  user_id: number
}

export enum FileTypes {
  IMAGE= "image"
}

