import { BadRequestException, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GoogleCreateUserDto } from '../types/users/users.dto';
import * as argon2 from 'argon2';
import { AuthJwtPayload, Role, SignInDto, SignUpDto, } from '../types/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import JwtConfig from './config/jwt.config';
import exchangeJwtConfig from './config/exchange-jwt.config';
import { PlansRepositoryService } from '../planner/plans.repository.service';
import { AppleUserAuthorizeResponse } from '../types/auth/apple.dto';
import { Users } from '../types/db/db';
import { Selectable } from 'kysely';
import { JWTPayload } from 'jose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(exchangeJwtConfig.KEY)
    private exchangeTokenConfig: ConfigType<typeof exchangeJwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findUserByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon2.hash(signUpDto.password);
    const user = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      role: Role.User,
    });

    return await this.login(user.id);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findUserByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException(
        'Invalid Email, please try again with correct email or register new account',
      );
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      signInDto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password, try again!');
    }

    return await this.login(user.id);
  }

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
    const payload = { sub: userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.exchangeTokenConfig.secret,
      expiresIn: this.exchangeTokenConfig?.expiresIn,
    });
  }

  async validateGoogleUser(googleUser: GoogleCreateUserDto) {
    const user = await this.usersService.findUserByEmail(googleUser.email);
    if (user) {
      return user;
    } else {
      return await this.usersService.createUser(googleUser);
    }
  }
  async validateAppleUser(
    user: string,
    payload: JWTPayload,
  ): Promise<Selectable<Users>> {
    const userObj: AppleUserAuthorizeResponse = JSON.parse(user);
    const userRecord = await this.usersService.findUserByAppleId(payload.sub);
    if (userRecord) {
      return userRecord;
    } else {
      return await this.usersService.createUser({
        appleId: payload.sub,
        email: payload.email,
        firstName: userObj.name?.firstName,
        lastName: userObj.name?.lastName,
        password: '',
        role: Role.User,
      });
    }
  }

  async signOut(userId: number) {
    await this.usersService.updateHashedRefreshToken(userId, null);
  }

  async login(id: number) {
    const { accessToken, refreshToken } = await this.generateTokens(id);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(id, hashedRefreshToken);
    const user = await this.usersService.findUserById(id);
    return {
      id: id,
      accessToken,
      refreshToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
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
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return { id: user.id, role: user.role as Role };
  }
}
