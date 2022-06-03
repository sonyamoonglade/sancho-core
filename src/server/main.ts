import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as path from 'path'
require('dotenv').config({
    path: path.resolve(__dirname,'.env'),

})

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
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
  const APP_PORT = Number(process.env.PORT) || 5001
//todo: apply dto validation!!
  await app.listen(APP_PORT, () => {
    console.log('Application has started on port', APP_PORT);
  });
}
bootstrap();
