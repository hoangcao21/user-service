import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [AuthenticationService, CookieService],
  exports: [AuthenticationService, CookieService],
})
export class AuthenticationModule {}
