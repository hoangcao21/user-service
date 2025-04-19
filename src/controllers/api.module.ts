import { Module } from '@nestjs/common';
import { AuthenticationApiModule } from './authentication/authentication.api.module';

@Module({ imports: [AuthenticationApiModule] })
export class ApiModule {}
