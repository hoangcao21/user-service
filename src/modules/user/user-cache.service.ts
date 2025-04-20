import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from 'src/shared/caching';
import { UserEntity } from './user.entity';

@Injectable()
export class UserCacheService extends CacheService {
  cacheParentKey: string = 'user/';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  keyConstruct(key: string): string {
    return `${this.cacheParentKey}/${key}`;
  }

  async setUser(userEntity: UserEntity): Promise<void> {
    await this.cacheManager.set(
      this.keyConstruct(userEntity.id),
      this.serialize(userEntity),
      30 * 1000, // 30 seconds
    );

    await this.cacheManager.set(
      this.keyConstruct(userEntity.userName),
      this.serialize(userEntity),
      30 * 1000, // 30 seconds
    );
  }

  async getUser(userIdOrUsername: string): Promise<UserEntity | null> {
    const value = (await this.cacheManager.get(
      this.keyConstruct(userIdOrUsername),
    )) as string;

    if (!value) {
      return null;
    }

    const userEntity = this.deserialize(value, UserEntity);

    return userEntity;
  }
}
