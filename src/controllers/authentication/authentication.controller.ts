import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { CookieCredentials } from 'src/modules/authentication/cookie.service';
import { AuthenticateOn } from 'src/shared/decorators/authenticate-on.decorator';
import { RawCookies } from 'src/shared/decorators/cookies.decorator';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { LoginDto } from './dtos/request/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  private sendCookies(cookies: CookieCredentials, res: Response) {
    res.header('Set-Cookie', [
      cookies.accessTokenCookie,
      cookies.refreshTokenCookie,
    ]);

    res.send();
  }

  @Post('sign-up')
  async signUp(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies: CookieCredentials = await this.authenticationService.signUp(
      dto.userName,
      dto.password,
    );

    Logger.log('✅ Sign up successfully!', { details: dto });

    this.sendCookies(cookies, res);
  }

  @Post('sign-in')
  async signIn(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies: CookieCredentials =
      await this.authenticationService.authenticate(dto.userName, dto.password);

    Logger.log('✅ Sign in successfully!', { details: dto });

    this.sendCookies(cookies, res);
  }

  @UseGuards(AuthenticationGuard)
  @AuthenticateOn('cookie_refresh_token')
  @Post('rotate')
  async rotateCredentials(
    @RawCookies('cookie_refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies: CookieCredentials =
      await this.authenticationService.refresh(refreshToken);

    Logger.log('✅ Rotate successfully!', { details: { refreshToken } });

    this.sendCookies(cookies, res);
  }
}
