import {Controller, Get, Req, Res} from "@nestjs/common";

import {Request, Response} from "express";


@Controller()
export class AppController {





    @Get('/')
    Get(@Res() res:Response){
        res.send("Hello world!")
    }

}