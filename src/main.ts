import '@dotenvx/dotenvx/config';

import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LokiLogger } from './shared/logger/loki.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new LokiLogger() });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
