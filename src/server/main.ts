import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import { ValidationPipe } from "@nestjs/common";
import { getConfig } from "./config/config";
import { UserService } from "./core/user/user.service";

require("dotenv").config({
   path: path.resolve(__dirname, ".env")
});

async function bootstrap() {
   const config = getConfig(process.env.NODE_ENV);
   console.log("config has initialized", config);
   const app = await NestFactory.create(AppModule);
   // {
   //    logger: ["error"]
   // }
   const userService: UserService = app.get<UserService>(UserService);
   app.setGlobalPrefix("/api/v1");

   const origins = ["https://zharpizza-front.herokuapp.com", "http://localhost:3001", "http://localhost:3000", "http://localhost:5001"];
   app.use(cookieParser());
   app.enableCors({
      origin: origins,
      credentials: true,
      allowedHeaders: ["Set-Cookie", "Content-type", "accept"]
   });
   app.useGlobalPipes(new ValidationPipe());
   console.log(process.env.PORT);
   const APP_PORT = Number(process.env.PORT) || Number(config.app.port);
   userService.registerSuperAdmin();
   await app.listen(APP_PORT, () => {
      console.log(`application is listening :${APP_PORT}`);
   });
}
bootstrap();
