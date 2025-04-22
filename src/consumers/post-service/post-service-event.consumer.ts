import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class PostServiceEventConsumer {
  @EventPattern('post_created')
  handlePostCreatedEvent(@Payload() eventPayload): any {
    Logger.log('Received "post_created" event from "post-service"', {
      payload: eventPayload,
    });
  }
}
