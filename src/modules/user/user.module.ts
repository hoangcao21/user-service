import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserCacheService } from './user-cache.service';
import { PostServiceKafkaClientModule } from 'src/shared/message-broker/client/post-service-kafka-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PostServiceKafkaClientModule,
  ],
  controllers: [],
  providers: [UserRepository, UserService, UserCacheService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
