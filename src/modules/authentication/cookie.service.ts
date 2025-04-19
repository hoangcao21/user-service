/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as ms from 'ms';

import { BadRequestException, Injectable } from '@nestjs/common';
import * as cookie from 'cookie';
import * as jsonwebtoken from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { JWT_SECRET_KEY } from 'src/shared/config/jwt';
import { UserEntity } from '../user/user.entity';

// eslint-disable-next-line @typescript-eslint/prefer-as-const
const ACCESS_TOKEN_COOKIE_KEY: 'cookie_access_token' = 'cookie_access_token';
// eslint-disable-next-line @typescript-eslint/prefer-as-const
const REFRESH_TOKEN_COOKIE_KEY: 'cookie_refresh_token' = 'cookie_refresh_token';

export type CredentialCookieKey =
  | typeof ACCESS_TOKEN_COOKIE_KEY
  | typeof REFRESH_TOKEN_COOKIE_KEY;

export interface JwtAccessTokenPayload {
  userId: string;
  userName: string;
  expiresAt: string;
}

export interface JwtRefreshTokenPayload {
  userId: string;
  userName: string;
  expiresAt: string;
  refreshToken: boolean;
}

export interface CookieCredentials {
  accessTokenCookie: string;
  refreshTokenCookie: string;
}

@Injectable()
export class CookieService {
  private verifyAndParseJwtToken<T extends object>(token: string): T {
    return jsonwebtoken.verify(token, JWT_SECRET_KEY) as T;
  }

  transformCookieIntoJwtPayload<
    T extends JwtAccessTokenPayload | JwtRefreshTokenPayload,
  >(
    cookieString: string,
    cookieKey: typeof ACCESS_TOKEN_COOKIE_KEY | typeof REFRESH_TOKEN_COOKIE_KEY,
  ): T {
    const cookieObject = cookie.parse(cookieString);

    const jwtToken = cookieObject[cookieKey];

    if (!jwtToken) {
      throw new BadRequestException(
        'COOKIE_NOT_FOUND',
        `Cookie ${cookieKey} is not found`,
      );
    }

    const token: T = this.verifyAndParseJwtToken<T>(jwtToken);

    return token;
  }

  generateAccessTokenCookie(userEntity: UserEntity): string {
    const thirtyMinutes: ms.StringValue = '30 minutes';

    const accessTokenExpiresInMilliseconds = ms(thirtyMinutes);

    const accessTokenExpiresAt = DateTime.now()
      .plus({ milliseconds: accessTokenExpiresInMilliseconds })
      .toUTC();

    const signedAccessToken = jsonwebtoken.sign(
      {
        userName: userEntity.userName,
        userId: userEntity.id,
        expiresAt: accessTokenExpiresAt.toISO(),
      } as JwtAccessTokenPayload,
      JWT_SECRET_KEY,
      { expiresIn: thirtyMinutes },
    );

    const accessTokenCookie = cookie.serialize(
      ACCESS_TOKEN_COOKIE_KEY,
      signedAccessToken,
      {
        httpOnly: true,
        path: '/',
        expires: accessTokenExpiresAt.toJSDate(),
        // secure: true,
        sameSite: 'none',
      },
    );

    return accessTokenCookie;
  }

  generateRefreshTokenCookie(userEntity: UserEntity): string {
    const sevenDays: ms.StringValue = '7 days';

    const refreshTokenExpiresInMilliseconds = ms(sevenDays);

    const refreshTokenExpiresAt = DateTime.now()
      .plus({ milliseconds: refreshTokenExpiresInMilliseconds })
      .toUTC();

    const signedRefreshToken = jsonwebtoken.sign(
      {
        userId: userEntity.id,
        userName: userEntity.userName,
        refreshToken: true,
        expiresAt: refreshTokenExpiresAt.toISO(),
      } as JwtRefreshTokenPayload,
      JWT_SECRET_KEY,
      { expiresIn: sevenDays },
    );

    const refreshTokenCookie = cookie.serialize(
      REFRESH_TOKEN_COOKIE_KEY,
      signedRefreshToken,
      {
        httpOnly: true,
        path: '/',
        expires: refreshTokenExpiresAt.toJSDate(),
        // secure: true,
        sameSite: 'none',
      },
    );

    return refreshTokenCookie;
  }
}
