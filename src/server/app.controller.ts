import {Controller, Get, Req, Res} from "@nestjs/common";

import {Request, Response} from "express";
import {CookieService} from "./shared/cookie/cookie.service";


@Controller()
export class AppController {




    constructor(private cookieService:CookieService) {
    }


    @Get('/')
    Get(@Res() res:Response){
        res.send("Hello world!")
    }

}