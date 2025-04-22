import '@dotenvx/dotenvx/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LokiLogger } from './shared/logger/loki.logger';
import {
  KAFKA_BROKER_URI,
  USER_SERVICE_CONSUMER_ID,
} from './shared/message-broker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new LokiLogger() });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER_URI],
      },
      consumer: {
        groupId: USER_SERVICE_CONSUMER_ID,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
