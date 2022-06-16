import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser'
import * as path from 'path'
import {ValidationPipe} from "@nestjs/common";

require('dotenv').config({
    path: path.resolve(__dirname,'.env'),

})

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("/api/v1")

    const origins = [
    "https://zharpizza-front.herokuapp.com",
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:5000"
    ]
    app.use(cookieParser())
    app.enableCors({
        origin: origins,
        credentials: true,

    })
    app.useGlobalPipes(new ValidationPipe())

    const APP_PORT = Number(process.env.PORT) || 5001
    await app.listen(APP_PORT, () => {
        console.log('Application has started on port', APP_PORT);
    });
}
bootstrap();
