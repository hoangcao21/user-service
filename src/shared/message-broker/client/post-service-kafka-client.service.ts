import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserCreatedEvent } from 'src/modules/user/events/user-created.event';
import { POST_SERVICE_KAFKA_CLIENT_INJECTION_TOKEN } from '..';

@Injectable()
export class PostServiceKafkaClientService {
  constructor(
    @Inject(POST_SERVICE_KAFKA_CLIENT_INJECTION_TOKEN)
    readonly kafkaClient: ClientKafka,
  ) {}

  sendUserCreated(userCreatedEvent: UserCreatedEvent) {
    this.kafkaClient.emit(`user_created`, userCreatedEvent);
  }
}
