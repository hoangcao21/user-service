import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  POST_SERVICE_CONSUMER_ID,
  KAFKA_BROKER_URI,
  POST_SERVICE_KAFKA_CLIENT_ID,
  POST_SERVICE_KAFKA_CLIENT_INJECTION_TOKEN,
} from '..';
import { PostServiceKafkaClientService } from './post-service-kafka-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: POST_SERVICE_KAFKA_CLIENT_INJECTION_TOKEN,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: POST_SERVICE_KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER_URI!],
          },
          consumer: {
            groupId: POST_SERVICE_CONSUMER_ID,
          },
        },
      },
    ]),
  ],
  providers: [PostServiceKafkaClientService],
  exports: [PostServiceKafkaClientService],
})
export class PostServiceKafkaClientModule {}
