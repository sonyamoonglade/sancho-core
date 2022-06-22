import { Controller, Get, Res } from "@nestjs/common";

import { Response } from "express";

@Controller()
export class AppController {
   @Get("/")
   Get(@Res() res: Response) {
      res.send("Hello world!");
   }
}
