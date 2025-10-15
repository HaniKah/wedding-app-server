import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/googleOauthConfig';
import { GoogleStrategy } from '../strategies/google.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UsersService } from '../users/users.service';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RefreshJwtStrategy } from '../strategies/refresh.strategy';

@Module({
  providers: [
    AuthService,
    GoogleStrategy,
    UsersService,
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
})
export class AuthModule {}
