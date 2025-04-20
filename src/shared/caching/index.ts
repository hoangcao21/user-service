import { ClassConstructor, plainToInstance } from 'class-transformer';

export abstract class CacheService {
  protected cacheParentKey: string;

  abstract keyConstruct(key: string): string;

  serialize(value: unknown) {
    return JSON.stringify(value);
  }

  deserialize<T>(value: string, classType?: ClassConstructor<T>): T {
    let output;

    output = JSON.parse(value);

    if (classType) {
      output = plainToInstance(classType, output);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return output;
  }
}
