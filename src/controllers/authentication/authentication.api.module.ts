import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [AuthenticationController],
  exports: [],
})
export class AuthenticationApiModule {}
