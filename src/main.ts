import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  if (process.env.VERCEL) {
    await app.init();
  } else {
    await app.listen(process.env.PORT ?? 3000);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  return app.getHttpAdapter().getInstance();
}

const appPromise = bootstrap();

export default async (req: IncomingMessage, res: ServerResponse) => {
  const app = await appPromise;
  return app(req, res);
};
