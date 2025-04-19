import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CredentialCookieKey } from 'src/modules/authentication/cookie.service';

export const RawCookies = createParamDecorator(
  (cookieKey: CredentialCookieKey, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    return cookieKey
      ? `${cookieKey}=${request.cookies?.[cookieKey]}`
      : request.headers['cookie'];
  },
);
