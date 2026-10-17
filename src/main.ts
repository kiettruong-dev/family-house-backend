import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance(); // Express instance
  }

  await app.listen(process.env.PORT ?? 3000);
  return app.getHttpAdapter().getInstance();
}

export default await bootstrap();
