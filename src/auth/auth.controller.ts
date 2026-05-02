import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import type { ConfigType } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import type { Request, Response } from 'express';
import { ExchangeAuthGuard } from './guards/exchange-auth/exchange-auth.guard';
import { ExchangeTokenDto } from '../types/auth/exchange.dto';
import { SignInDto, SignUpDto } from '../types/auth/auth.dto';
import AppleOauthConfig from './config/appleOauth.config';
import GoogleOauthConfig from './config/googleOauth.config';
import { AppleAuthGuard } from './guards/apple-auth/apple-auth.guard';
import { AppleAuthorizeRequestParams } from '../types/auth/apple.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(AppleOauthConfig.KEY)
    private readonly appleOauthConfig: ConfigType<typeof AppleOauthConfig>,
    @Inject(GoogleOauthConfig.KEY)
    private readonly googleOathConfig: ConfigType<typeof GoogleOauthConfig>,
  ) {}

  @Public()
  @Get('error')
  public errorTest() {
    throw new BadRequestException(' custom text is working fine');
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req.user.id);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<ExchangeTokenDto> {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<ExchangeTokenDto> {
    return await this.authService.signIn(signInDto);
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
  @Get('apple/login')
  appleLogin(
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const params = new URLSearchParams({
      client_id: this.appleOauthConfig.clientID,
      redirect_uri: this.appleOauthConfig.callbackURL,
      response_type: 'code',
      scope: scope || 'name email',
      state: state,
      response_mode: 'form_post',
    } satisfies AppleAuthorizeRequestParams);
    return res.redirect(
      this.appleOauthConfig.appleAuthUrl + '?' + params.toString(),
    );
  }

  @Public()
  @UseGuards(AppleAuthGuard)
  @Post('apple/callback')
  async appleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Body('state') state: string,
  ): Promise<void> {
    const exchangeToken = await this.authService.generateExchangeToken(
      req.user.id,
    );
    const redirectUrl =
      this.appleOauthConfig.appScheme +
      '?exchangeToken=' +
      exchangeToken +
      '&state=' +
      state;
    return res.redirect(redirectUrl);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state: string,
  ): Promise<void> {
    const exchangeToken = await this.authService.generateExchangeToken(
      req.user.id,
    );
    const redirectUrl =
      this.googleOathConfig.appScheme +
      '?exchangeToken=' +
      exchangeToken +
      '&state=' +
      state;
    return res.redirect(redirectUrl);
  }

  @Public()
  @UseGuards(ExchangeAuthGuard)
  @Post('exchangeToken')
  async exchangeToken(@Req() req: Request): Promise<ExchangeTokenDto> {
    return await this.authService.login(req.user.id);
  }
}
