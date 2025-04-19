import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { AuthenticateOn } from '../decorators/authenticate-on.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  @Inject(AuthenticationService)
  private readonly authenticationService: AuthenticationService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const cookieKey = this.reflector.get(AuthenticateOn, context.getHandler());

    if (!request.headers) {
      throw new UnauthorizedException(
        'COOKIE_NOT_FOUND_ERR',
        'Cookie is not present in headers',
      );
    }

    const rawCookies = request.headers['cookie'];

    if (!rawCookies) {
      throw new UnauthorizedException(
        'COOKIE_NOT_FOUND_ERR',
        'Cookie is not present in headers',
      );
    }

    const allowed = this.authenticationService.allow(rawCookies, cookieKey);

    if (!allowed) {
      throw new UnauthorizedException(
        'AUTHENTICATION_FAILED_ERROR',
        'Cookie is invalid',
      );
    }

    return true;
  }
}
