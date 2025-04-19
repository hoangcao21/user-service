import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findOneByUserName(userName: string): Promise<UserEntity | null> {
    const userEntity = await this.repo.findOne({ where: { userName } });

    return userEntity;
  }

  async findOneByUserId(userId: string): Promise<UserEntity | null> {
    const userEntity = await this.repo.findOne({ where: { id: userId } });

    return userEntity;
  }

  async createOne(userEntity: UserEntity): Promise<UserEntity> {
    return this.repo.save(userEntity);
  }
}
