import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/googleOauth.config';
import { GoogleStrategy } from '../strategies/google.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UsersService } from '../users/users.service';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RefreshJwtStrategy } from '../strategies/refresh.strategy';
import exchangeJwtConfig from './config/exchange-jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { PlansRepositoryService } from '../planner/plans.repository.service';
import webhookJwtConfig from './config/webhook-jwt.config';
import { WebhookJwtStrategy } from '../strategies/webhook-jwt.strategy';
import { AppleStrategy } from '../strategies/apple.strategy';
import appleOauthConfig from './config/appleOauth.config';

@Module({
  providers: [
    AuthService,
    GoogleStrategy,
    AppleStrategy,
    UsersService,
    PlansRepositoryService,
    JwtStrategy,
    RefreshJwtStrategy,
    WebhookJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(exchangeJwtConfig),
    ConfigModule.forFeature(webhookJwtConfig),
    ConfigModule.forFeature(appleOauthConfig),
  ],
})
export class AuthModule {}
