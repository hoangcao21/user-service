import { Injectable } from '@nestjs/common';
import { UserCacheService } from './user-cache.service';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { PostServiceKafkaClientService } from 'src/shared/message-broker/client/post-service-kafka-client.service';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userCacheService: UserCacheService,
    private readonly postServiceKafkaClientService: PostServiceKafkaClientService,
  ) {}

  async getUserByUserName(userName: string): Promise<UserEntity | null> {
    let userEntity = await this.userCacheService.getUser(userName);

    if (!userEntity) {
      userEntity = await this.userRepo.findOneByUserName(userName);

      if (!userEntity) {
        return null;
      }

      await this.userCacheService.setUser(userEntity);
    }

    return userEntity;
  }

  async getUserById(userId: string): Promise<UserEntity | null> {
    let userEntity = await this.userCacheService.getUser(userId);

    if (!userEntity) {
      userEntity = await this.userRepo.findOneByUserId(userId);

      if (!userEntity) {
        return null;
      }

      await this.userCacheService.setUser(userEntity);
    }

    return userEntity;
  }

  async createUser(
    userName: string,
    hashedPassword: string,
  ): Promise<UserEntity | null> {
    let userEntity: UserEntity = new UserEntity();
    userEntity.userName = userName;
    userEntity.hashedPassword = hashedPassword;

    userEntity = await this.userRepo.createOne(userEntity);

    this.postServiceKafkaClientService.sendUserCreated(
      new UserCreatedEvent(userEntity.id, userEntity.createdAt.toUTCString()),
    );

    return userEntity;
  }
}
