import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserByUserName(userName: string): Promise<UserEntity | null> {
    return this.userRepo.findOneByUserName(userName);
  }

  async getUserById(userId: string): Promise<UserEntity | null> {
    return this.userRepo.findOneByUserId(userId);
  }

  async createUser(
    userName: string,
    hashedPassword: string,
  ): Promise<UserEntity | null> {
    const userEntity: UserEntity = new UserEntity();
    userEntity.userName = userName;
    userEntity.hashedPassword = hashedPassword;

    return this.userRepo.createOne(userEntity);
  }
}
