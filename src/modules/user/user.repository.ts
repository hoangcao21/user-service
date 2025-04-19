import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

export class UserRepository extends Repository<UserEntity> {
  async findOneByUserName(userName: string): Promise<UserEntity | null> {
    const userEntity = await this.findOne({ where: { userName } });

    return userEntity;
  }

  async findOneByUserId(userId: string): Promise<UserEntity | null> {
    const userEntity = await this.findOne({ where: { id: userId } });

    return userEntity;
  }
}
