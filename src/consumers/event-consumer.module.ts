import { Module } from '@nestjs/common';
import { PostServiceEventModule } from './post-service/post-service-event.module';

@Module({ imports: [PostServiceEventModule] })
export class EventConsumerModule {}
