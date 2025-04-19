import { Reflector } from '@nestjs/core';
import { CredentialCookieKey } from 'src/modules/authentication/cookie.service';

export const AuthenticateOn = Reflector.createDecorator<CredentialCookieKey>();
