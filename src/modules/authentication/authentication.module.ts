import { Global, Module } from '@nestjs/common';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { UserModule } from '../user/user.module';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';

@Global()
@Module({
  imports: [UserModule],
  controllers: [],
  providers: [AuthenticationService, CookieService, AuthenticationGuard],
  exports: [AuthenticationService, CookieService, AuthenticationGuard],
})
export class AuthenticationModule {}
