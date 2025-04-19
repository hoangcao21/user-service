import { BadRequestException, Injectable } from '@nestjs/common';
import { compareHash, doHashing } from 'src/shared/crypto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  CookieCredentials,
  CookieService,
  CredentialCookieKey,
  JwtAccessTokenPayload,
  JwtRefreshTokenPayload,
} from './cookie.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
  ) {}

  private generateCookies(userEntity: UserEntity): CookieCredentials {
    return {
      accessTokenCookie:
        this.cookieService.generateAccessTokenCookie(userEntity),
      refreshTokenCookie:
        this.cookieService.generateRefreshTokenCookie(userEntity),
    };
  }

  async signUp(userName: string, password: string): Promise<CookieCredentials> {
    if (await this.userService.getUserByUserName(userName)) {
      throw new BadRequestException(
        'USER_ALREADY_EXISTS_ERROR',
        `Username ${userName} already exist`,
      );
    }

    const hashedPassword: string = await doHashing(password);

    const userEntity = await this.userService.createUser(
      userName,
      hashedPassword,
    );

    return this.generateCookies(userEntity!);
  }

  async authenticate(
    userName: string,
    password: string,
  ): Promise<CookieCredentials> {
    const userEntity = await this.userService.getUserByUserName(userName);

    if (!userEntity) {
      console.log('❌ Failed to authenticate. User is not existing in DB', {
        userName,
      }); // TODO: Change to loki

      throw new BadRequestException(
        'AUTHENTICATION_ERROR',
        'Failed to authenticate with provided credentials',
      );
    }

    if (!(await compareHash(password, userEntity.hashedPassword))) {
      throw new BadRequestException(
        'AUTHENTICATION_ERROR',
        'Failed to authenticate with provided credentials',
      );
    }

    return this.generateCookies(userEntity);
  }

  async refresh(refreshTokenCookie: string): Promise<CookieCredentials> {
    try {
      const refreshTokenPayload: JwtRefreshTokenPayload =
        this.cookieService.transformCookieIntoJwtPayload<JwtRefreshTokenPayload>(
          refreshTokenCookie,
          'cookie_refresh_token',
        );

      const userEntity = await this.userService.getUserByUserName(
        refreshTokenPayload.userName,
      );

      if (!userEntity) {
        console.log('❌ Failed to authenticate. User is not existing in DB', {
          userName: refreshTokenPayload.userName,
        });

        throw new BadRequestException(
          'AUTHENTICATION_ERROR',
          'Failed to authenticate with provided credentials',
        );
      }

      return this.generateCookies(userEntity);
    } catch (error) {
      console.log('❌ Token is unverified', { details: error });

      throw new BadRequestException(
        'INVALID_TOKEN_ERROR',
        'Failed to verify token',
      );
    }
  }

  allow<T extends JwtAccessTokenPayload | JwtRefreshTokenPayload>(
    cookieString: string,
    cookieKey: CredentialCookieKey,
  ): boolean {
    try {
      return !!this.cookieService.transformCookieIntoJwtPayload<T>(
        cookieString,
        cookieKey,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
