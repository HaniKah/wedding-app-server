import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { UsersService } from '../users/users.service';
import { GoogleCreateUserDto } from '../types/users/users.dto';
import * as argon2 from 'argon2';
import { EmailService } from '../email/email.service';
import { EmailOtpRepositoryService } from './email-otp.repository.service';
import {
  AuthJwtPayload,
  Role,
  SignInDto,
  SignUpDto,
} from '../types/auth/auth.dto';
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

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private readonly emailService: EmailService,
    private readonly emailOtpRepository: EmailOtpRepositoryService,
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
      signUpDto.email.toLowerCase(),
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await argon2.hash(signUpDto.password);
    const user = await this.usersService.createUser({
      ...signUpDto,
      email: signUpDto.email.toLowerCase(),
      password: hashedPassword,
      role: Role.User,
    });

    // No tokens are issued yet — the user must verify their email first.
    await this.sendVerificationCode(user.id, user.email);
    return {
      requiresVerification: true,
      email: user.email,
      message: 'A verification code has been sent to your email.',
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findUserByEmail(
      signInDto.email.toLowerCase(),
    );
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
    //todo : this deactivates the email verification

    // TEMPORARILY DISABLED: email verification requirement
    // if (!user.emailVerified) {
    //   await this.sendVerificationCode(user.id, user.email);
    //   throw new ForbiddenException({
    //     message: 'Email not verified. A new verification code has been sent.',
    //     requiresVerification: true,
    //     email: user.email,
    //   });
    // }

    return await this.login(user.id);
  }

  async sendVerificationCode(userId: number, email: string) {
    const lastCreatedAt =
      await this.emailOtpRepository.getLastCreatedAt(userId);
    if (
      lastCreatedAt &&
      Date.now() - new Date(lastCreatedAt).getTime() < OTP_RESEND_COOLDOWN_MS
    ) {
      throw new BadRequestException(
        'Please wait a moment before requesting another code.',
      );
    }

    const code = this.generateOtp();
    const codeHash = await argon2.hash(code);
    await this.emailOtpRepository.createOtp(
      userId,
      codeHash,
      new Date(Date.now() + OTP_TTL_MS),
    );
    await this.emailService.sendOtpEmail(email, code);
  }

  /** Resend a code by email (used by the resend endpoint). */
  async resendVerificationCode(email: string) {
    const user = await this.usersService.findUserByEmail(email.toLowerCase());
    if (!user) {
      throw new BadRequestException('No account found for this email.');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified.');
    }
    await this.sendVerificationCode(user.id, user.email);
    return { message: 'A verification code has been sent to your email.' };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findUserByEmail(email.toLowerCase());
    if (!user) {
      throw new BadRequestException('No account found for this email.');
    }
    if (user.emailVerified) {
      return await this.login(user.id);
    }

    const otp = await this.emailOtpRepository.findActiveOtp(user.id);
    if (!otp) {
      throw new BadRequestException(
        'Verification code has expired or was not found. Please request a new one.',
      );
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestException(
        'Too many attempts. Please request a new code.',
      );
    }

    const isValid = await argon2.verify(otp.codeHash, code);
    if (!isValid) {
      await this.emailOtpRepository.incrementAttempts(otp.id);
      throw new BadRequestException('Invalid verification code.');
    }

    await this.emailOtpRepository.consumeOtp(otp.id);
    await this.usersService.updateUser(user.id, { emailVerified: true });

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
    const user = await this.usersService.findUserByGoogleId(
      googleUser.google_id,
    );
    if (user) {
      return user;
    } else {
      return await this.usersService.createUser(googleUser);
    }
  }

  async validateAppleUser(
    user: AppleUserAuthorizeResponse | undefined,
    payload: JWTPayload,
  ): Promise<Selectable<Users>> {
    if (!payload.sub) {
      throw new InternalServerErrorException(
        'user Id was not provided by apple',
      );
    }
    const userRecord = await this.usersService.findUserByAppleId(payload.sub);
    if (userRecord) {
      return userRecord;
    } else {
      return await this.usersService.createUser({
        appleId: payload?.sub,
        email: user?.email || payload?.email,
        firstName: user?.name?.firstName,
        lastName: user?.name?.lastName,
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

  private generateOtp(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }
}
