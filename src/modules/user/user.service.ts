import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserByUserName(userName: string): Promise<UserEntity | null> {
    return this.userRepo.findOneByUserName(userName);
  }

  async getUserById(userId: string): Promise<UserEntity | null> {
    return this.userRepo.findOneByUserId(userId);
  }
}
