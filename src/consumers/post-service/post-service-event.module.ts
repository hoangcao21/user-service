import { Module } from '@nestjs/common';
import { PostServiceEventConsumer } from './post-service-event.consumer';

@Module({ providers: [PostServiceEventConsumer] })
export class PostServiceEventModule {}
