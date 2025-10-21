import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../types/users/users.dto';
import * as argon2 from 'argon2';
import { AuthJwtPayload, Role } from '../types/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import JwtConfig from './config/jwt.config';
import { Selectable } from 'kysely';
import { Users } from 'kysely-codegen';
import exchangeJwtConfig from './config/exchange-jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(exchangeJwtConfig.KEY)
    private exchangeTokenConfig: ConfigType<typeof exchangeJwtConfig>,
  ) {}

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async generateExchangeToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId, role: Role.User };
    return await this.jwtService.signAsync(payload, {
      secret: this.exchangeTokenConfig.secret,
      expiresIn: this.exchangeTokenConfig?.expiresIn,
    });
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findUserByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.createUser(googleUser);
  }

  async signOut(userId: number) {
    await this.usersService.updateHashedRefreshToken(userId, null);
  }

  async login(id: number) {
    // const payload: AuthJwtPayload = { sub: userId };
    // const token = this.jwtService.sign(payload);
    // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    const { accessToken, refreshToken } = await this.generateTokens(id);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(id, hashedRefreshToken);
    return {
      id: id,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId, role: Role.User };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.secret as string,
        expiresIn: this.jwtConfig.signOptions?.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: userId };
  }

  async validateJwtUser(userId: number) {
    const user: Selectable<Users> =
      await this.usersService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return { id: user.id, role: user.role };
  }
}
