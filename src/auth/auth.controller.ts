import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import type { Request, Response } from 'express';
import { ExchangeAuthGuard } from './guards/exchange-auth/exchange-auth.guard';
import { ExchangeTokenDto } from '../types/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Req() req: Request) {
    if (!req.user?.id) return;
    await this.authService.signOut(req.user?.id);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const exchangeToken = await this.authService.generateExchangeToken(
      req.user.id,
    );
    const redirectUrl =
      this.configService.get<string>('APP_SCHEME') +
      '?exchangeToken=' +
      exchangeToken;
    return res.redirect(redirectUrl);
  }

  //a guard that checks whether the exchange token is valid and returns access token and refresh token
  @Public()
  @UseGuards(ExchangeAuthGuard)
  @Post('exchangeToken')
  async exchangeToken(@Req() req: Request): Promise<ExchangeTokenDto> {
    const userId = req.user?.id;
    return await this.authService.login(userId);
  }
}
