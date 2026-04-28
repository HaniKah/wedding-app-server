import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import type { Request, Response } from 'express';
import { ExchangeAuthGuard } from './guards/exchange-auth/exchange-auth.guard';
import { ExchangeTokenDto } from '../types/auth/exchange.dto';
import { SignInDto, SignUpDto } from '../types/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
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
      this.configService.get<string>('APP_SCHEME') +
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
