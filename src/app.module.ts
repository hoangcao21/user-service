import * as KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './controllers/api.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { REDIS_URI } from './shared/config/caching';
import { dataSourceOptions } from './shared/database/data-source';
import { CatchEverythingFilter } from './shared/filters/catch-everything.filter';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthenticationModule, // Global module
    ApiModule,
    CacheModule.registerAsync({
      // Global module
      useFactory: async () => {
        return {
          stores: [KeyvRedis.createKeyv(REDIS_URI)],
        };
      },
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    { provide: APP_FILTER, useClass: CatchEverythingFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
